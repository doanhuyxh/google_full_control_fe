import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import {
    createTelegramAccount,
    deleteTelegramAccount,
    getTelegramAccountDetail,
    getTelegramAccounts,
    updateTelegramAccount,
} from "@/libs/network/telegram.api";

const QUERY_KEY = "telegram-accounts";

export function useTelegramAccountQueries() {
    const queryClient = useQueryClient();
    const [pageTele, setPageTele] = useState<number>(1);
    const [limitTele, setLimitTele] = useState<number>(30);
    const [searchTele, setSearchTele] = useState<string>("");
    const debouncedSearch = useDebounce<string>(searchTele, 600);

    const queryKey = [QUERY_KEY, pageTele, limitTele, debouncedSearch] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch, isError, error } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getTelegramAccounts(pageTele, limitTele, debouncedSearch);
            if (!result.status) throw new Error(result.message);
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (formData: FormData) => createTelegramAccount(formData),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ teleId, formData }: { teleId: string; formData: FormData }) =>
            updateTelegramAccount(teleId, formData),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTelegramAccount(id),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    return {
        listTelegramAccount: response?.data?.items ?? [],
        loadingTele: isFetching,
        fetchTelegramAccounts: refetch,
        pageTele,
        setPageTele,
        limitTele,
        setLimitTele,
        searchTele,
        setSearchTele,
        totalPagesTele: response?.data?.pagination?.totalPages ?? 0,
        totalItemsTele: response?.data?.pagination?.total ?? 0,
        isFetchError: isError,
        fetchError: error,
        createMutation,
        updateMutation,
        deleteMutation,
    };
}

export function useTelegramAccountDetailQueries(teleId: string, enabled: boolean) {
    return useQuery({
        queryKey: ["telegram-account-detail", teleId],
        queryFn: async () => {
            const result = await getTelegramAccountDetail(teleId);
            if (!result.status) throw new Error(result.message);
            return result.data;
        },
        enabled: enabled && !!teleId,
        ...NO_CACHE_QUERY_OPTIONS,
    });
}

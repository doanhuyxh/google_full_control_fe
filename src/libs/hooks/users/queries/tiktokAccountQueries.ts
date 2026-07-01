import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { FormTikTokAccountData } from "@/libs/interfaces/tiktokData";
import {
    addTikTokAccount,
    deleteTikTokAccount,
    getTikTokAccount,
    updateTikTokAccount,
} from "@/libs/network/tiktok.api";

const QUERY_KEY = "tiktok-accounts";

export function useTikTokAccountQueries() {
    const queryClient = useQueryClient();
    const [pageTikTok, setPageTikTok] = useState<number>(1);
    const [limitTikTok, setLimitTikTok] = useState<number>(30);
    const [searchTikTok, setSearchTikTok] = useState<string>("");
    const debouncedSearch = useDebounce<string>(searchTikTok, 600);

    const queryKey = [QUERY_KEY, pageTikTok, limitTikTok, debouncedSearch] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch, isError, error } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getTikTokAccount(pageTikTok, limitTikTok, debouncedSearch);
            if (!result.status) throw new Error(result.message);
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (payload: FormTikTokAccountData) => addTikTokAccount(payload),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: FormTikTokAccountData }) =>
            updateTikTokAccount(id, payload),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTikTokAccount(id),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const updateTikTokField = async (id: string, field: string, value: unknown) => {
        const listTikTokAccount = response?.data?.items ?? [];
        const currentAccount = listTikTokAccount.find((acc) => acc._id === id);
        if (!currentAccount) return;

        const formData: FormTikTokAccountData = {
            uniqueId: currentAccount.uniqueId,
            password: currentAccount.password,
            email: currentAccount.email,
            phoneNumber: currentAccount.phoneNumber,
            f2a: currentAccount.f2a,
            countryCode: currentAccount.countryCode,
            cookies: currentAccount.cookies,
            uid: currentAccount.uid,
            secUid: currentAccount.secUid,
            nickName: currentAccount.nickName,
            signature: currentAccount.signature,
            [field]: value,
        };

        return updateMutation.mutateAsync({ id, payload: formData });
    };

    return {
        listTikTokAccount: response?.data?.items ?? [],
        loadingTikTok: isFetching,
        fetchTikTokAccounts: refetch,
        pageTikTok,
        setPageTikTok,
        limitTikTok,
        setLimitTikTok,
        searchTikTok,
        setSearchTikTok,
        totalPagesTikTok: response?.data?.pagination?.totalPages ?? 0,
        totalItemsTikTok: response?.data?.pagination?.total ?? 0,
        isFetchError: isError,
        fetchError: error,
        createMutation,
        updateMutation,
        deleteMutation,
        updateTikTokField,
    };
}

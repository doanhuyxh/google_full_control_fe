import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import {
    ZaloPersonalDataFormData,
    ZaloPersonalDataUpdateData,
} from "@/libs/interfaces/zaloPersonal";
import {
    createZaloPersonalAccount,
    deleteZaloPersonalAccount,
    getLoginInfoAccZalo,
    getZaloPersonalAccount,
    loginZaloPersonalViaCookie,
    updateZaloPersonalAccount,
} from "@/libs/network/zalo-personal.api";

const QUERY_KEY = "zalo-personal-accounts";

export function useZaloPersonalAccountQueries() {
    const queryClient = useQueryClient();
    const [pageZaloPersonal, setPageZaloPersonal] = useState<number>(1);
    const [limitZaloPersonal, setLimitZaloPersonal] = useState<number>(30);
    const [searchZaloPersonal, setSearchZaloPersonal] = useState<string>("");
    const debouncedSearch = useDebounce<string>(searchZaloPersonal, 600);

    const queryKey = [QUERY_KEY, pageZaloPersonal, limitZaloPersonal, debouncedSearch] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getZaloPersonalAccount(pageZaloPersonal, limitZaloPersonal, debouncedSearch);
            if (!result.status) throw new Error(result.message);
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (payload: ZaloPersonalDataFormData) => createZaloPersonalAccount(payload),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ZaloPersonalDataUpdateData }) =>
            updateZaloPersonalAccount(id, payload),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteZaloPersonalAccount(id),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const loginViaCookieMutation = useMutation({
        mutationFn: (id: string) => loginZaloPersonalViaCookie(id),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const getLoginInfoMutation = useMutation({
        mutationFn: (id: string) => getLoginInfoAccZalo(id),
    });

    return {
        accountData: response?.data?.items ?? [],
        loadingZaloPersonal: isFetching,
        fetchZaloPersonalAccounts: refetch,
        pageZaloPersonal,
        setPageZaloPersonal,
        limitZaloPersonal,
        setLimitZaloPersonal,
        searchZaloPersonal,
        setSearchZaloPersonal,
        totalPagesZaloPersonal: response?.data?.pagination?.totalPages ?? 0,
        totalItemsZaloPersonal: response?.data?.pagination?.total ?? 0,
        createMutation,
        updateMutation,
        deleteMutation,
        loginViaCookieMutation,
        getLoginInfoMutation,
    };
}

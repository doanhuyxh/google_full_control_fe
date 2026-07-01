import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { FormRevapiData } from "@/libs/interfaces/revapiData";
import {
    createRevapiData,
    deleteRevapiData,
    getApiKeyInfo,
    getRevapiData,
    getUpdateCredit,
    loginRevapiData,
    updateRevapiData,
} from "@/libs/network/revapi.api";

const QUERY_KEY = "revidapi-accounts";

export function useRevidApiAccountQueries() {
    const queryClient = useQueryClient();
    const [pageRevidApi, setPageRevidApi] = useState<number>(1);
    const [limitRevidApi, setLimitRevidApi] = useState<number>(30);
    const [searchRevidApi, setSearchRevidApi] = useState<string>("");
    const debouncedSearch = useDebounce<string>(searchRevidApi, 600);

    const queryKey = [QUERY_KEY, pageRevidApi, limitRevidApi, debouncedSearch] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch, isError, error } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getRevapiData(pageRevidApi, limitRevidApi, debouncedSearch);
            if (!result.status) throw new Error(result.message);
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (payload: FormRevapiData) => createRevapiData(payload),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: FormRevapiData }) =>
            updateRevapiData(id, payload),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteRevapiData(id),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const bulkLoginMutation = useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map((id) => loginRevapiData(id))),
        onSuccess: (results) => {
            const successCount = results.filter((r) => r.status).length;
            if (successCount > 0) invalidateList();
        },
    });

    const bulkApiKeyMutation = useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map((id) => getApiKeyInfo(id))),
        onSuccess: (results) => {
            const successCount = results.filter((r) => r.status).length;
            if (successCount > 0) invalidateList();
        },
    });

    const bulkCreditMutation = useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map((id) => getUpdateCredit(id))),
        onSuccess: (results) => {
            const successCount = results.filter((r) => r.status).length;
            if (successCount > 0) invalidateList();
        },
    });

    const syncAllMutation = useMutation({
        mutationFn: async (ids: string[]) => {
            const results = await Promise.all(
                ids.map(async (id) => {
                    const loginRes = await loginRevapiData(id);
                    if (!loginRes.status) return { success: false, reason: "login_failed" };

                    const accessToken = loginRes.data?.access_token;
                    if (!accessToken || !String(accessToken).trim()) {
                        return { success: false, reason: "missing_access_token" };
                    }

                    const [apiKeyRes, creditRes] = await Promise.all([
                        getApiKeyInfo(id),
                        getUpdateCredit(id),
                    ]);
                    const success = apiKeyRes.status && creditRes.status;
                    return { success, reason: success ? "ok" : "get_api_failed" };
                })
            );
            return results;
        },
        onSuccess: (results) => {
            const successCount = results.filter((r) => r.success).length;
            if (successCount > 0) invalidateList();
        },
    });

    const importMutation = useMutation({
        mutationFn: (rows: FormRevapiData[]) => Promise.all(rows.map((row) => createRevapiData(row))),
        onSuccess: (results) => {
            const successCount = results.filter((r) => r.status).length;
            if (successCount > 0) invalidateList();
        },
    });

    const updateRevidApiField = async (id: string, field: string, value: string) => {
        const listRevidApiAccount = response?.data?.items ?? [];
        const currentAccount = listRevidApiAccount.find((acc) => acc._id === id);
        if (!currentAccount) return;

        const formData: FormRevapiData = {
            email: currentAccount.email,
            password: currentAccount.password,
            access_token: currentAccount.access_token,
            api_key: currentAccount.api_key,
            [field]: value,
        };

        return updateMutation.mutateAsync({ id, payload: formData });
    };

    return {
        listRevidApiAccount: response?.data?.items ?? [],
        loadingRevidApi: isFetching,
        fetchRevidApiAccounts: refetch,
        pageRevidApi,
        setPageRevidApi,
        limitRevidApi,
        setLimitRevidApi,
        searchRevidApi,
        setSearchRevidApi,
        totalPagesRevidApi: response?.data?.pagination?.totalPages ?? 0,
        totalItemsRevidApi: response?.data?.pagination?.total ?? 0,
        isFetchError: isError,
        fetchError: error,
        createMutation,
        updateMutation,
        deleteMutation,
        bulkLoginMutation,
        bulkApiKeyMutation,
        bulkCreditMutation,
        syncAllMutation,
        importMutation,
        updateRevidApiField,
    };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import ZaloPersonalData, {
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

export function useZaloPersonalAccount() {
    const queryClient = useQueryClient();
    const { notification } = useAntdApp();
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
            if (!result.status) {
                notification.error({ message: "Error", description: result.message });
                return;
            }
            notification.success({ message: "Success", description: "Data saved successfully" });
            invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ZaloPersonalDataUpdateData }) =>
            updateZaloPersonalAccount(id, payload),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({ message: "Error", description: result.message });
                return;
            }
            notification.success({ message: "Success", description: "Data saved successfully" });
            invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteZaloPersonalAccount(id),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Error",
                    description: result.message || "An error occurred while deleting the Zalo Personal account.",
                });
                return;
            }
            notification.success({
                message: "Success",
                description: "Zalo Personal account has been deleted successfully.",
            });
            invalidateList();
        },
    });

    const loginViaCookieMutation = useMutation({
        mutationFn: (id: string) => loginZaloPersonalViaCookie(id),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Error",
                    description: result.message || "An error occurred while logging in via cookie.",
                });
                return;
            }
            notification.success({
                message: "Success",
                description: "Login via cookie initiated successfully.",
            });
            invalidateList();
        },
    });

    const getLoginInfoMutation = useMutation({
        mutationFn: (id: string) => getLoginInfoAccZalo(id),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Error",
                    description: result.message || "An error occurred while fetching account details.",
                });
            }
        },
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
        createZaloPersonalAccount: createMutation.mutateAsync,
        updateZaloPersonalAccount: updateMutation.mutateAsync,
        deleteZaloPersonalAccount: deleteMutation.mutateAsync,
        loginZaloViaCookie: loginViaCookieMutation.mutateAsync,
        getZaloLoginInfo: getLoginInfoMutation.mutateAsync,
        isCreatingZalo: createMutation.isPending,
        isUpdatingZalo: updateMutation.isPending,
        isDeletingZalo: deleteMutation.isPending,
        isLoggingInZalo: loginViaCookieMutation.isPending,
        isLoadingZaloLoginInfo: getLoginInfoMutation.isPending,
        zaloLoginInfoData: getLoginInfoMutation.data?.status ? getLoginInfoMutation.data.data : null,
    };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { FormAppleIdData } from "@/libs/interfaces/appleIdData";
import {
    createAppleIDAccount,
    deleteAppleIDAccount,
    getAppleIDAccounts,
    updateAppleIDAccount,
} from "@/libs/network/appleId.api";

const QUERY_KEY = "apple-id-accounts";

export function useAppleIdHook() {
    const queryClient = useQueryClient();
    const { notification } = useAntdApp();
    const [pageAppleId, setPageAppleId] = useState<number>(1);
    const [limitAppleId, setLimitAppleId] = useState<number>(30);
    const [searchAppleId, setSearchAppleId] = useState<string>("");
    const debouncedSearch = useDebounce<string>(searchAppleId, 600);

    const queryKey = [QUERY_KEY, pageAppleId, limitAppleId, debouncedSearch] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getAppleIDAccounts(pageAppleId, limitAppleId, debouncedSearch);
            if (!result.status) throw new Error(result.message);
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (payload: FormAppleIdData) => createAppleIDAccount(payload),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({ message: "Lỗi", description: result.message });
                return;
            }
            notification.success({ message: "Thành công", description: "Tài khoản Apple ID đã được tạo mới thành công." });
            invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: FormAppleIdData }) =>
            updateAppleIDAccount(id, payload),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({ message: "Lỗi", description: result.message });
                return;
            }
            notification.success({ message: "Thành công", description: "Tài khoản Apple ID đã được cập nhật thành công." });
            invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAppleIDAccount(id),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Error",
                    description: result.message || "An error occurred while deleting the Apple ID account.",
                });
                return;
            }
            notification.success({
                message: "Success",
                description: "Apple ID account has been deleted successfully.",
            });
            invalidateList();
        },
    });

    return {
        accountData: response?.data?.items ?? [],
        loadingAppleId: isFetching,
        fetchAppleIdAccounts: refetch,
        pageAppleId,
        setPageAppleId,
        limitAppleId,
        setLimitAppleId,
        searchAppleId,
        setSearchAppleId,
        totalPagesAppleId: response?.data?.pagination?.totalPages ?? 0,
        totalItemsAppleId: response?.data?.pagination?.total ?? 0,
        createAppleIdAccount: createMutation.mutateAsync,
        updateAppleIdAccount: updateMutation.mutateAsync,
        deleteAppleIdAccount: deleteMutation.mutateAsync,
        isCreatingAppleId: createMutation.isPending,
        isUpdatingAppleId: updateMutation.isPending,
        isDeletingAppleId: deleteMutation.isPending,
    };
}

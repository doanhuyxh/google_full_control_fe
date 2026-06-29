import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { GoogleAccountCreateData } from "@/libs/interfaces/googleData";
import {
    createGoogleAccount,
    deleteGoogleAccount,
    getGoogleAccount,
    sendMailToOtherEmail,
    updateGoogleAccount,
} from "@/libs/network/google.api";

const QUERY_KEY = "google-accounts";

export function useGoogleAccount() {
    const queryClient = useQueryClient();
    const { notification } = useAntdApp();
    const [pageGoogle, setPageGoogle] = useState<number>(1);
    const [limitGoogle, setLimitGoogle] = useState<number>(30);
    const [statusGoogle, setStatusGoogle] = useState<string>("");
    const [searchGoogle, setSearchGoogle] = useState<string>("");

    const queryKey = [QUERY_KEY, pageGoogle, limitGoogle, statusGoogle, searchGoogle] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getGoogleAccount(pageGoogle, limitGoogle, statusGoogle, searchGoogle);
            if (!result.status) throw new Error(result.message);
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (payload: GoogleAccountCreateData) => createGoogleAccount(payload),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Lỗi",
                    description: result.message || "Không thể lưu tài khoản Google. Vui lòng thử lại sau.",
                });
                return;
            }
            notification.success({ message: "Thành công", description: "Lưu tài khoản Google thành công." });
            invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, field, value }: { id: string; field: string; value: unknown }) =>
            updateGoogleAccount(id, field, value),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Cập nhật thất bại",
                    description: result.message || "Đã có lỗi xảy ra khi cập nhật dữ liệu.",
                });
                return;
            }
            notification.success({
                message: "Cập nhật thành công",
                description: "Dữ liệu đã được cập nhật thành công.",
            });
            invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteGoogleAccount(id),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Xóa thất bại",
                    description: result.message || "Đã có lỗi xảy ra khi xóa tài khoản.",
                });
                return;
            }
            notification.success({
                message: "Xóa thành công",
                description: "Tài khoản đã được xóa thành công.",
            });
            invalidateList();
        },
    });

    const sendEmailMutation = useMutation({
        mutationFn: ({
            fromAccountId,
            to,
            subject,
            message,
        }: {
            fromAccountId: string;
            to: string;
            subject: string;
            message: string;
        }) => sendMailToOtherEmail(fromAccountId, to, subject, message),
    });

    const updateGoogleField = async (id: string, field: string, value: unknown) => {
        if (value === undefined || value === null || value === "") return;
        return updateMutation.mutateAsync({ id, field, value });
    };

    return {
        accountData: response?.data?.items ?? [],
        loadingGoogle: isFetching,
        fetchGoogleAccounts: refetch,
        pageGoogle,
        setPageGoogle,
        limitGoogle,
        setLimitGoogle,
        statusGoogle,
        setStatusGoogle,
        searchGoogle,
        setSearchGoogle,
        totalPagesGoogle: response?.data?.pagination?.totalPages ?? 0,
        totalItemsGoogle: response?.data?.pagination?.total ?? 0,
        createGoogleAccount: createMutation.mutateAsync,
        updateGoogleField,
        deleteGoogleAccount: deleteMutation.mutateAsync,
        sendMailToOtherEmail: sendEmailMutation.mutateAsync,
        isCreatingGoogle: createMutation.isPending,
        isUpdatingGoogle: updateMutation.isPending,
        isDeletingGoogle: deleteMutation.isPending,
        isSendingEmail: sendEmailMutation.isPending,
    };
}

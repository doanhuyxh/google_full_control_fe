import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import  { FormTikTokAccountData } from "@/libs/interfaces/tiktokData";
import {
    addTikTokAccount,
    deleteTikTokAccount,
    getTikTokAccount,
    updateTikTokAccount,
} from "@/libs/network/tiktok.api";

const QUERY_KEY = "tiktok-accounts";

export function useTikTokAccount() {
    const queryClient = useQueryClient();
    const { notification } = useAntdApp();
    const [pageTikTok, setPageTikTok] = useState<number>(1);
    const [limitTikTok, setLimitTikTok] = useState<number>(30);
    const [searchTikTok, setSearchTikTok] = useState<string>("");
    const debouncedSearch = useDebounce<string>(searchTikTok, 600);

    const queryKey = [QUERY_KEY, pageTikTok, limitTikTok, debouncedSearch] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getTikTokAccount(pageTikTok, limitTikTok, debouncedSearch);
            if (!result.status) {
                notification.error({
                    message: "Lấy danh sách tài khoản TikTok thất bại",
                    description: result.message || "Không thể kết nối đến máy chủ",
                });
                throw new Error(result.message);
            }
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (payload: FormTikTokAccountData) => addTikTokAccount(payload),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({ message: "Lỗi", description: result.message });
                return;
            }
            notification.success({ message: "Thành công", description: "Thêm tài khoản TikTok thành công." });
            invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: FormTikTokAccountData }) =>
            updateTikTokAccount(id, payload),
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
        mutationFn: (id: string) => deleteTikTokAccount(id),
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

        await updateMutation.mutateAsync({ id, payload: formData });
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
        createTikTokAccount: createMutation.mutateAsync,
        updateTikTokAccount: updateMutation.mutateAsync,
        deleteTikTokAccount: deleteMutation.mutateAsync,
        updateTikTokField,
        isCreatingTikTok: createMutation.isPending,
        isUpdatingTikTok: updateMutation.isPending,
        isDeletingTikTok: deleteMutation.isPending,
    };
}

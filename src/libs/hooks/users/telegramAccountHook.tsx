import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import {
    createTelegramAccount,
    deleteTelegramAccount,
    getTelegramAccountDetail,
    getTelegramAccounts,
    updateTelegramAccount,
} from "@/libs/network/telegram.api";

const QUERY_KEY = "telegram-accounts";

export function useTelegramAccount() {
    const queryClient = useQueryClient();
    const { notification } = useAntdApp();
    const [pageTele, setPageTele] = useState<number>(1);
    const [limitTele, setLimitTele] = useState<number>(30);
    const [searchTele, setSearchTele] = useState<string>("");
    const debouncedSearch = useDebounce<string>(searchTele, 600);

    const queryKey = [QUERY_KEY, pageTele, limitTele, debouncedSearch] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getTelegramAccounts(pageTele, limitTele, debouncedSearch);
            if (!result.status) {
                notification.error({
                    message: "Lấy danh sách tài khoản Telegram thất bại",
                    description: result.message || "Không thể kết nối đến máy chủ",
                });
                throw new Error(result.message);
            }
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (formData: FormData) => createTelegramAccount(formData),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Tạo tài khoản Telegram thất bại",
                    description: result.message || "Không thể kết nối đến máy chủ",
                });
                return;
            }
            notification.success({ message: "Tạo tài khoản Telegram thành công" });
            invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ teleId, formData }: { teleId: string; formData: FormData }) =>
            updateTelegramAccount(teleId, formData),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Cập nhật tài khoản Telegram thất bại",
                    description: result.message || "Không thể kết nối đến máy chủ",
                });
                return;
            }
            notification.success({ message: "Cập nhật tài khoản Telegram thành công" });
            invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTelegramAccount(id),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Xóa tài khoản Telegram thất bại",
                    description: result.message || "Không thể kết nối đến máy chủ",
                });
                return;
            }
            notification.success({ message: "Xóa tài khoản Telegram thành công" });
            invalidateList();
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
        createTelegramAccount: createMutation.mutateAsync,
        updateTelegramAccount: updateMutation.mutateAsync,
        deleteTelegramAccount: deleteMutation.mutateAsync,
        isCreatingTelegram: createMutation.isPending,
        isUpdatingTelegram: updateMutation.isPending,
        isDeletingTelegram: deleteMutation.isPending,
    };
}

export function useTelegramAccountDetail(teleId: string, enabled: boolean) {
    const { notification } = useAntdApp();

    return useQuery({
        queryKey: ["telegram-account-detail", teleId],
        queryFn: async () => {
            const result = await getTelegramAccountDetail(teleId);
            if (!result.status) {
                notification.error({
                    message: "Lấy chi tiết tài khoản Telegram thất bại",
                    description: result.message || "Không thể kết nối đến máy chủ",
                });
                throw new Error(result.message);
            }
            return result.data;
        },
        enabled: enabled && !!teleId,
        ...NO_CACHE_QUERY_OPTIONS,
    });
}

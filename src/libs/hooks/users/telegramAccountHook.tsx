import { useAntdApp } from "@/libs/hooks/useAntdApp";

import {
    useTelegramAccountDetailQueries,
    useTelegramAccountQueries,
} from "./queries/telegramAccountQueries";
import { notifyMutationResult, useQueryFetchErrorNotification } from "./useMutationNotifications";

export function useTelegramAccount() {
    const { notification } = useAntdApp();
    const {
        createMutation,
        updateMutation,
        deleteMutation,
        isFetchError,
        fetchError,
        ...rest
    } = useTelegramAccountQueries();

    useQueryFetchErrorNotification(
        isFetchError,
        fetchError,
        "Lấy danh sách tài khoản Telegram thất bại"
    );

    const createTelegramAccount = async (formData: FormData) =>
        notifyMutationResult(await createMutation.mutateAsync(formData), notification, {
            successMessage: "Tạo tài khoản Telegram thành công",
            successDescription: "",
            errorMessage: "Tạo tài khoản Telegram thất bại",
            errorDescription: "Không thể kết nối đến máy chủ",
        });

    const updateTelegramAccount = async (args: { teleId: string; formData: FormData }) =>
        notifyMutationResult(await updateMutation.mutateAsync(args), notification, {
            successMessage: "Cập nhật tài khoản Telegram thành công",
            successDescription: "",
            errorMessage: "Cập nhật tài khoản Telegram thất bại",
            errorDescription: "Không thể kết nối đến máy chủ",
        });

    const deleteTelegramAccount = async (id: string) =>
        notifyMutationResult(await deleteMutation.mutateAsync(id), notification, {
            successMessage: "Xóa tài khoản Telegram thành công",
            successDescription: "",
            errorMessage: "Xóa tài khoản Telegram thất bại",
            errorDescription: "Không thể kết nối đến máy chủ",
        });

    return {
        ...rest,
        createTelegramAccount,
        updateTelegramAccount,
        deleteTelegramAccount,
        isCreatingTelegram: createMutation.isPending,
        isUpdatingTelegram: updateMutation.isPending,
        isDeletingTelegram: deleteMutation.isPending,
    };
}

export function useTelegramAccountDetail(teleId: string, enabled: boolean) {
    const { notification } = useAntdApp();
    const query = useTelegramAccountDetailQueries(teleId, enabled);

    useQueryFetchErrorNotification(
        query.isError,
        query.error,
        "Lấy chi tiết tài khoản Telegram thất bại"
    );

    return query;
}

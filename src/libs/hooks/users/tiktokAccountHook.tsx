import { FormTikTokAccountData } from "@/libs/interfaces/tiktokData";
import { useAntdApp } from "@/libs/hooks/useAntdApp";

import { useTikTokAccountQueries } from "./queries/tiktokAccountQueries";
import { notifyMutationResult, useQueryFetchErrorNotification } from "./useMutationNotifications";

export function useTikTokAccount() {
    const { notification } = useAntdApp();
    const {
        createMutation,
        updateMutation,
        deleteMutation,
        updateTikTokField: updateTikTokFieldQuery,
        isFetchError,
        fetchError,
        ...rest
    } = useTikTokAccountQueries();

    useQueryFetchErrorNotification(
        isFetchError,
        fetchError,
        "Lấy danh sách tài khoản TikTok thất bại"
    );

    const createTikTokAccount = async (payload: FormTikTokAccountData) =>
        notifyMutationResult(await createMutation.mutateAsync(payload), notification, {
            successMessage: "Thành công",
            successDescription: "Thêm tài khoản TikTok thành công.",
        });

    const updateTikTokAccount = async (args: { id: string; payload: FormTikTokAccountData }) =>
        notifyMutationResult(await updateMutation.mutateAsync(args), notification, {
            successMessage: "Cập nhật thành công",
            successDescription: "Dữ liệu đã được cập nhật thành công.",
            errorMessage: "Cập nhật thất bại",
            errorDescription: "Đã có lỗi xảy ra khi cập nhật dữ liệu.",
        });

    const deleteTikTokAccount = async (id: string) =>
        notifyMutationResult(await deleteMutation.mutateAsync(id), notification, {
            successMessage: "Xóa thành công",
            successDescription: "Tài khoản đã được xóa thành công.",
            errorMessage: "Xóa thất bại",
            errorDescription: "Đã có lỗi xảy ra khi xóa tài khoản.",
        });

    const updateTikTokField = async (id: string, field: string, value: unknown) => {
        const result = await updateTikTokFieldQuery(id, field, value);
        if (!result) return;
        return notifyMutationResult(result, notification, {
            successMessage: "Cập nhật thành công",
            successDescription: "Dữ liệu đã được cập nhật thành công.",
            errorMessage: "Cập nhật thất bại",
            errorDescription: "Đã có lỗi xảy ra khi cập nhật dữ liệu.",
        });
    };

    return {
        ...rest,
        createTikTokAccount,
        updateTikTokAccount,
        deleteTikTokAccount,
        updateTikTokField,
        isCreatingTikTok: createMutation.isPending,
        isUpdatingTikTok: updateMutation.isPending,
        isDeletingTikTok: deleteMutation.isPending,
    };
}

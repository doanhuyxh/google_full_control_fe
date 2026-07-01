import { GoogleAccountCreateData } from "@/libs/interfaces/googleData";
import { useAntdApp } from "@/libs/hooks/useAntdApp";

import { useGoogleAccountQueries } from "./queries/googleAccountQueries";
import { notifyMutationResult } from "./useMutationNotifications";

export function useGoogleAccount() {
    const { notification } = useAntdApp();
    const {
        createMutation,
        updateMutation,
        deleteMutation,
        sendEmailMutation,
        updateGoogleField: updateGoogleFieldQuery,
        ...rest
    } = useGoogleAccountQueries();

    const createGoogleAccount = async (payload: GoogleAccountCreateData) =>
        notifyMutationResult(await createMutation.mutateAsync(payload), notification, {
            successMessage: "Thành công",
            successDescription: "Lưu tài khoản Google thành công.",
            errorDescription: "Không thể lưu tài khoản Google. Vui lòng thử lại sau.",
        });

    const updateGoogleField = async (id: string, field: string, value: unknown) => {
        const result = await updateGoogleFieldQuery(id, field, value);
        if (!result) return;
        return notifyMutationResult(result, notification, {
            successMessage: "Cập nhật thành công",
            successDescription: "Dữ liệu đã được cập nhật thành công.",
            errorMessage: "Cập nhật thất bại",
            errorDescription: "Đã có lỗi xảy ra khi cập nhật dữ liệu.",
        });
    };

    const deleteGoogleAccount = async (id: string) =>
        notifyMutationResult(await deleteMutation.mutateAsync(id), notification, {
            successMessage: "Xóa thành công",
            successDescription: "Tài khoản đã được xóa thành công.",
            errorMessage: "Xóa thất bại",
            errorDescription: "Đã có lỗi xảy ra khi xóa tài khoản.",
        });

    return {
        ...rest,
        createGoogleAccount,
        updateGoogleField,
        deleteGoogleAccount,
        sendMailToOtherEmail: sendEmailMutation.mutateAsync,
        isCreatingGoogle: createMutation.isPending,
        isUpdatingGoogle: updateMutation.isPending,
        isDeletingGoogle: deleteMutation.isPending,
        isSendingEmail: sendEmailMutation.isPending,
    };
}

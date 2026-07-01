import { FormAppleIdData } from "@/libs/interfaces/appleIdData";
import { useAntdApp } from "@/libs/hooks/useAntdApp";

import { useAppleIdQueries } from "./queries/appleIdQueries";
import { notifyMutationResult } from "./useMutationNotifications";

export function useAppleIdHook() {
    const { notification } = useAntdApp();
    const {
        createMutation,
        updateMutation,
        deleteMutation,
        ...rest
    } = useAppleIdQueries();

    const createAppleIdAccount = async (payload: FormAppleIdData) =>
        notifyMutationResult(await createMutation.mutateAsync(payload), notification, {
            successMessage: "Thành công",
            successDescription: "Tài khoản Apple ID đã được tạo mới thành công.",
        });

    const updateAppleIdAccount = async (args: { id: string; payload: FormAppleIdData }) =>
        notifyMutationResult(await updateMutation.mutateAsync(args), notification, {
            successMessage: "Thành công",
            successDescription: "Tài khoản Apple ID đã được cập nhật thành công.",
        });

    const deleteAppleIdAccount = async (id: string) =>
        notifyMutationResult(await deleteMutation.mutateAsync(id), notification, {
            successMessage: "Success",
            successDescription: "Apple ID account has been deleted successfully.",
            errorMessage: "Error",
            errorDescription: "An error occurred while deleting the Apple ID account.",
        });

    return {
        ...rest,
        createAppleIdAccount,
        updateAppleIdAccount,
        deleteAppleIdAccount,
        isCreatingAppleId: createMutation.isPending,
        isUpdatingAppleId: updateMutation.isPending,
        isDeletingAppleId: deleteMutation.isPending,
    };
}

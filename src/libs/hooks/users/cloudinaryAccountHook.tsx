import { CloudinaryDataFormData } from "@/libs/interfaces/cloudinaryData";
import { useAntdApp } from "@/libs/hooks/useAntdApp";

import { useCloudinaryAccountQueries } from "./queries/cloudinaryAccountQueries";
import { notifyMutationResult } from "./useMutationNotifications";

export function useCloudinaryAccount() {
    const { notification } = useAntdApp();
    const {
        createMutation,
        updateMutation,
        deleteMutation,
        usageMutation,
        ...rest
    } = useCloudinaryAccountQueries();

    const createCloudinaryAccount = async (payload: CloudinaryDataFormData) =>
        notifyMutationResult(await createMutation.mutateAsync(payload), notification, {
            successMessage: "Success",
            successDescription: "Cloudinary account has been created successfully.",
            errorMessage: "Error",
        });

    const updateCloudinaryAccount = async (args: { id: string; payload: CloudinaryDataFormData }) =>
        notifyMutationResult(await updateMutation.mutateAsync(args), notification, {
            successMessage: "Success",
            successDescription: "Cloudinary account has been updated successfully.",
            errorMessage: "Error",
        });

    const deleteCloudinaryAccount = async (id: string) =>
        notifyMutationResult(await deleteMutation.mutateAsync(id), notification, {
            successMessage: "Success",
            successDescription: "Cloudinary account has been deleted successfully.",
            errorMessage: "Error",
            errorDescription: "An error occurred while deleting the Cloudinary account.",
        });

    const fetchCloudinaryUsage = async (id: string) => {
        const result = await usageMutation.mutateAsync(id);
        if (!result.status) {
            notification.error({
                message: "Error",
                description: result.message || "An error occurred while fetching Cloudinary usage data.",
            });
        }
        return result;
    };

    return {
        ...rest,
        createCloudinaryAccount,
        updateCloudinaryAccount,
        deleteCloudinaryAccount,
        fetchCloudinaryUsage,
        isCreatingCloudinary: createMutation.isPending,
        isUpdatingCloudinary: updateMutation.isPending,
        isDeletingCloudinary: deleteMutation.isPending,
        isLoadingCloudinaryUsage: usageMutation.isPending,
        cloudinaryUsageData: usageMutation.data?.status ? usageMutation.data.data : null,
    };
}

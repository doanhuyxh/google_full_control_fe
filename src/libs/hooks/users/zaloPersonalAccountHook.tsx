import {
    ZaloPersonalDataFormData,
    ZaloPersonalDataUpdateData,
} from "@/libs/interfaces/zaloPersonal";
import { useAntdApp } from "@/libs/hooks/useAntdApp";

import { useZaloPersonalAccountQueries } from "./queries/zaloPersonalAccountQueries";
import { notifyMutationResult } from "./useMutationNotifications";

export function useZaloPersonalAccount() {
    const { notification } = useAntdApp();
    const {
        createMutation,
        updateMutation,
        deleteMutation,
        loginViaCookieMutation,
        getLoginInfoMutation,
        ...rest
    } = useZaloPersonalAccountQueries();

    const createZaloPersonalAccount = async (payload: ZaloPersonalDataFormData) =>
        notifyMutationResult(await createMutation.mutateAsync(payload), notification, {
            successMessage: "Success",
            successDescription: "Data saved successfully",
            errorMessage: "Error",
        });

    const updateZaloPersonalAccount = async (args: {
        id: string;
        payload: ZaloPersonalDataUpdateData;
    }) =>
        notifyMutationResult(await updateMutation.mutateAsync(args), notification, {
            successMessage: "Success",
            successDescription: "Data saved successfully",
            errorMessage: "Error",
        });

    const deleteZaloPersonalAccount = async (id: string) =>
        notifyMutationResult(await deleteMutation.mutateAsync(id), notification, {
            successMessage: "Success",
            successDescription: "Zalo Personal account has been deleted successfully.",
            errorMessage: "Error",
            errorDescription: "An error occurred while deleting the Zalo Personal account.",
        });

    const loginZaloViaCookie = async (id: string) =>
        notifyMutationResult(await loginViaCookieMutation.mutateAsync(id), notification, {
            successMessage: "Success",
            successDescription: "Login via cookie initiated successfully.",
            errorMessage: "Error",
            errorDescription: "An error occurred while logging in via cookie.",
        });

    const getZaloLoginInfo = async (id: string) => {
        const result = await getLoginInfoMutation.mutateAsync(id);
        if (!result.status) {
            notification.error({
                message: "Error",
                description: result.message || "An error occurred while fetching account details.",
            });
        }
        return result;
    };

    return {
        ...rest,
        createZaloPersonalAccount,
        updateZaloPersonalAccount,
        deleteZaloPersonalAccount,
        loginZaloViaCookie,
        getZaloLoginInfo,
        isCreatingZalo: createMutation.isPending,
        isUpdatingZalo: updateMutation.isPending,
        isDeletingZalo: deleteMutation.isPending,
        isLoggingInZalo: loginViaCookieMutation.isPending,
        isLoadingZaloLoginInfo: getLoginInfoMutation.isPending,
        zaloLoginInfoData: getLoginInfoMutation.data?.status ? getLoginInfoMutation.data.data : null,
    };
}

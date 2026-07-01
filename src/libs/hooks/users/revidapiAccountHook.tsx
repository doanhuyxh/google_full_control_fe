import { FormRevapiData } from "@/libs/interfaces/revapiData";
import { useAntdApp } from "@/libs/hooks/useAntdApp";

import { useRevidApiAccountQueries } from "./queries/revidapiAccountQueries";
import { notifyMutationResult, useQueryFetchErrorNotification } from "./useMutationNotifications";

export function useRevidApiAccount() {
    const { notification } = useAntdApp();
    const {
        createMutation,
        updateMutation,
        deleteMutation,
        bulkLoginMutation,
        bulkApiKeyMutation,
        bulkCreditMutation,
        syncAllMutation,
        importMutation,
        updateRevidApiField: updateRevidApiFieldQuery,
        isFetchError,
        fetchError,
        ...rest
    } = useRevidApiAccountQueries();

    useQueryFetchErrorNotification(
        isFetchError,
        fetchError,
        "Lấy danh sách Revid API thất bại"
    );

    const createRevidApiAccount = async (payload: FormRevapiData) =>
        notifyMutationResult(await createMutation.mutateAsync(payload), notification, {
            successMessage: "Thành công",
            successDescription: "Thêm tài khoản Revid API thành công.",
        });

    const updateRevidApiAccount = async (args: { id: string; payload: FormRevapiData }) =>
        notifyMutationResult(await updateMutation.mutateAsync(args), notification, {
            successMessage: "Cập nhật thành công",
            successDescription: "Cập nhật tài khoản Revid API thành công.",
            errorMessage: "Cập nhật thất bại",
            errorDescription: "Đã có lỗi xảy ra khi cập nhật dữ liệu.",
        });

    const deleteRevidApiAccount = async (id: string) =>
        notifyMutationResult(await deleteMutation.mutateAsync(id), notification, {
            successMessage: "Xóa thành công",
            successDescription: "Tài khoản đã được xóa thành công.",
            errorMessage: "Xóa thất bại",
            errorDescription: "Đã có lỗi xảy ra khi xóa tài khoản.",
        });

    const bulkLoginRevidApi = async (ids: string[]) => {
        const results = await bulkLoginMutation.mutateAsync(ids);
        const successCount = results.filter((r) => r.status).length;
        notification.info({
            message: "Kết quả Login active",
            description: `Thành công ${successCount}/${results.length}`,
        });
        return results;
    };

    const bulkApiKeyRevidApi = async (ids: string[]) => {
        const results = await bulkApiKeyMutation.mutateAsync(ids);
        const successCount = results.filter((r) => r.status).length;
        notification.info({
            message: "Kết quả API Key active",
            description: `Thành công ${successCount}/${results.length}`,
        });
        return results;
    };

    const bulkCreditRevidApi = async (ids: string[]) => {
        const results = await bulkCreditMutation.mutateAsync(ids);
        const successCount = results.filter((r) => r.status).length;
        notification.info({
            message: "Kết quả Lấy Credit",
            description: `Thành công ${successCount}/${results.length}`,
        });
        return results;
    };

    const syncAllRevidApi = async (ids: string[]) => {
        const results = await syncAllMutation.mutateAsync(ids);
        const successCount = results.filter((r) => r.success).length;
        const failedCount = results.length - successCount;
        const missingTokenCount = results.filter((r) => r.reason === "missing_access_token").length;
        notification.info({
            message: "Kết quả Đồng bộ tất cả",
            description: `Thành công ${successCount}/${results.length}. Thất bại ${failedCount}/${results.length}. Thiếu access_token: ${missingTokenCount}.`,
        });
        return results;
    };

    const updateRevidApiField = async (id: string, field: string, value: string) => {
        const result = await updateRevidApiFieldQuery(id, field, value);
        if (!result) return;
        return notifyMutationResult(result, notification, {
            successMessage: "Cập nhật thành công",
            successDescription: "Cập nhật tài khoản Revid API thành công.",
            errorMessage: "Cập nhật thất bại",
            errorDescription: "Đã có lỗi xảy ra khi cập nhật dữ liệu.",
        });
    };

    return {
        ...rest,
        createRevidApiAccount,
        updateRevidApiAccount,
        deleteRevidApiAccount,
        updateRevidApiField,
        bulkLoginRevidApi,
        bulkApiKeyRevidApi,
        bulkCreditRevidApi,
        syncAllRevidApi,
        importRevidApiAccounts: importMutation.mutateAsync,
        isBulkLoading:
            bulkLoginMutation.isPending ||
            bulkApiKeyMutation.isPending ||
            bulkCreditMutation.isPending ||
            syncAllMutation.isPending,
        isImportingRevidApi: importMutation.isPending,
        isCreatingRevidApi: createMutation.isPending,
        isUpdatingRevidApi: updateMutation.isPending,
    };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { FormRevapiData } from "@/libs/interfaces/revapiData";
import {
    createRevapiData,
    deleteRevapiData,
    getApiKeyInfo,
    getRevapiData,
    getUpdateCredit,
    loginRevapiData,
    updateRevapiData,
} from "@/libs/network/revapi.api";

const QUERY_KEY = "revidapi-accounts";

export function useRevidApiAccount() {
    const queryClient = useQueryClient();
    const { notification } = useAntdApp();
    const [pageRevidApi, setPageRevidApi] = useState<number>(1);
    const [limitRevidApi, setLimitRevidApi] = useState<number>(30);
    const [searchRevidApi, setSearchRevidApi] = useState<string>("");
    const debouncedSearch = useDebounce<string>(searchRevidApi, 600);

    const queryKey = [QUERY_KEY, pageRevidApi, limitRevidApi, debouncedSearch] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getRevapiData(pageRevidApi, limitRevidApi, debouncedSearch);
            if (!result.status) {
                notification.error({
                    message: "Lấy danh sách Revid API thất bại",
                    description: result.message || "Không thể kết nối đến máy chủ",
                });
                throw new Error(result.message);
            }
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (payload: FormRevapiData) => createRevapiData(payload),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({ message: "Lỗi", description: result.message });
                return;
            }
            notification.success({ message: "Thành công", description: "Thêm tài khoản Revid API thành công." });
            invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: FormRevapiData }) =>
            updateRevapiData(id, payload),
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
                description: "Cập nhật tài khoản Revid API thành công.",
            });
            invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteRevapiData(id),
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

    const bulkLoginMutation = useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map((id) => loginRevapiData(id))),
        onSuccess: (results) => {
            const successCount = results.filter((r) => r.status).length;
            if (successCount > 0) invalidateList();
            notification.info({
                message: "Kết quả Login active",
                description: `Thành công ${successCount}/${results.length}`,
            });
        },
    });

    const bulkApiKeyMutation = useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map((id) => getApiKeyInfo(id))),
        onSuccess: (results) => {
            const successCount = results.filter((r) => r.status).length;
            if (successCount > 0) invalidateList();
            notification.info({
                message: "Kết quả API Key active",
                description: `Thành công ${successCount}/${results.length}`,
            });
        },
    });

    const bulkCreditMutation = useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map((id) => getUpdateCredit(id))),
        onSuccess: (results) => {
            const successCount = results.filter((r) => r.status).length;
            if (successCount > 0) invalidateList();
            notification.info({
                message: "Kết quả Lấy Credit",
                description: `Thành công ${successCount}/${results.length}`,
            });
        },
    });

    const syncAllMutation = useMutation({
        mutationFn: async (ids: string[]) => {
            const results = await Promise.all(
                ids.map(async (id) => {
                    const loginRes = await loginRevapiData(id);
                    if (!loginRes.status) return { success: false, reason: "login_failed" };

                    const accessToken = loginRes.data?.access_token;
                    if (!accessToken || !String(accessToken).trim()) {
                        return { success: false, reason: "missing_access_token" };
                    }

                    const [apiKeyRes, creditRes] = await Promise.all([
                        getApiKeyInfo(id),
                        getUpdateCredit(id),
                    ]);
                    const success = apiKeyRes.status && creditRes.status;
                    return { success, reason: success ? "ok" : "get_api_failed" };
                })
            );
            return results;
        },
        onSuccess: (results) => {
            const successCount = results.filter((r) => r.success).length;
            const failedCount = results.length - successCount;
            const missingTokenCount = results.filter((r) => r.reason === "missing_access_token").length;
            if (successCount > 0) invalidateList();
            notification.info({
                message: "Kết quả Đồng bộ tất cả",
                description: `Thành công ${successCount}/${results.length}. Thất bại ${failedCount}/${results.length}. Thiếu access_token: ${missingTokenCount}.`,
            });
        },
    });

    const importMutation = useMutation({
        mutationFn: (rows: FormRevapiData[]) => Promise.all(rows.map((row) => createRevapiData(row))),
        onSuccess: (results) => {
            const successCount = results.filter((r) => r.status).length;
            if (successCount > 0) invalidateList();
        },
    });

    const updateRevidApiField = async (id: string, field: string, value: string) => {
        const listRevidApiAccount = response?.data?.items ?? [];
        const currentAccount = listRevidApiAccount.find((acc) => acc._id === id);
        if (!currentAccount) return;

        const formData: FormRevapiData = {
            email: currentAccount.email,
            password: currentAccount.password,
            access_token: currentAccount.access_token,
            api_key: currentAccount.api_key,
            [field]: value,
        };

        await updateMutation.mutateAsync({ id, payload: formData });
    };

    return {
        listRevidApiAccount: response?.data?.items ?? [],
        loadingRevidApi: isFetching,
        fetchRevidApiAccounts: refetch,
        pageRevidApi,
        setPageRevidApi,
        limitRevidApi,
        setLimitRevidApi,
        searchRevidApi,
        setSearchRevidApi,
        totalPagesRevidApi: response?.data?.pagination?.totalPages ?? 0,
        totalItemsRevidApi: response?.data?.pagination?.total ?? 0,
        createRevidApiAccount: createMutation.mutateAsync,
        updateRevidApiAccount: updateMutation.mutateAsync,
        deleteRevidApiAccount: deleteMutation.mutateAsync,
        updateRevidApiField,
        bulkLoginRevidApi: bulkLoginMutation.mutateAsync,
        bulkApiKeyRevidApi: bulkApiKeyMutation.mutateAsync,
        bulkCreditRevidApi: bulkCreditMutation.mutateAsync,
        syncAllRevidApi: syncAllMutation.mutateAsync,
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

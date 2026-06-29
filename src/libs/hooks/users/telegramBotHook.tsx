import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import {
    createBot,
    deleteBot,
    getBotsByTelegramAccount,
    testBotConnection,
    updateBot,
} from "@/libs/network/telegram.api";

const QUERY_KEY = "telegram-bots";

export function useTelegramBot(telegramId: string, enabled: boolean) {
    const queryClient = useQueryClient();
    const { notification } = useAntdApp();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const queryKey = [QUERY_KEY, telegramId, page, limit, debouncedSearch] as const;

    const invalidateList = () =>
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY, telegramId] });

    const { data: response, isFetching, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getBotsByTelegramAccount(telegramId, page, limit, debouncedSearch);
            if (!result.status) {
                notification.error({
                    message: "Lỗi khi tải danh sách bot",
                    description: result.message || "Đã xảy ra lỗi không xác định.",
                });
                throw new Error(result.message);
            }
            return result;
        },
        enabled: enabled && !!telegramId,
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: ({
            botToken,
            botUsername,
            note,
        }: {
            botToken: string;
            botUsername: string;
            note: string;
        }) => createBot(telegramId, botToken, botUsername, note),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({ message: "Lỗi", description: result.message });
                return;
            }
            notification.success({ message: "Tạo bot thành công" });
            invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            botId,
            botToken,
            botUsername,
            note,
        }: {
            botId: string;
            botToken: string;
            botUsername: string;
            note: string;
        }) => updateBot(telegramId, botId, botToken, botUsername, note),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Lỗi khi cập nhật bot",
                    description: result.message || "Đã xảy ra lỗi không xác định.",
                });
                return;
            }
            notification.success({ message: "Cập nhật bot thành công" });
            invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (botId: string) => deleteBot(telegramId, botId),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Lỗi khi xóa bot",
                    description: result.message || "Đã xảy ra lỗi không xác định.",
                });
                return;
            }
            notification.success({ message: "Xóa bot thành công" });
            invalidateList();
        },
    });

    const testMutation = useMutation({
        mutationFn: (botId: string) => testBotConnection(telegramId, botId),
        onSuccess: (result) => {
            if (!result.status) {
                notification.error({
                    message: "Lỗi khi gửi tin nhắn test",
                    description: result.message || "Đã xảy ra lỗi không xác định.",
                });
                return;
            }
            notification.success({ message: "Gửi tin nhắn test thành công" });
        },
    });

    return {
        botList: response?.data?.items ?? [],
        totalItems: response?.data?.pagination?.total ?? 0,
        loading: isFetching,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        fetchBotList: refetch,
        createBot: createMutation.mutateAsync,
        updateBot: updateMutation.mutateAsync,
        deleteBot: deleteMutation.mutateAsync,
        testBotConnection: testMutation.mutateAsync,
        isCreatingBot: createMutation.isPending,
        isUpdatingBot: updateMutation.isPending,
        isDeletingBot: deleteMutation.isPending,
        isTestingBot: testMutation.isPending,
    };
}

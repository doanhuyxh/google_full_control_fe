import { useAntdApp } from "@/libs/hooks/useAntdApp";

import { useTelegramBotQueries } from "./queries/telegramBotQueries";
import { notifyMutationResult, useQueryFetchErrorNotification } from "./useMutationNotifications";

export function useTelegramBot(telegramId: string, enabled: boolean) {
    const { notification } = useAntdApp();
    const {
        createMutation,
        updateMutation,
        deleteMutation,
        testMutation,
        isFetchError,
        fetchError,
        ...rest
    } = useTelegramBotQueries(telegramId, enabled);

    useQueryFetchErrorNotification(
        isFetchError,
        fetchError,
        "Lỗi khi tải danh sách bot",
        "Đã xảy ra lỗi không xác định."
    );

    const createBot = async (args: { botToken: string; botUsername: string; note: string }) =>
        notifyMutationResult(await createMutation.mutateAsync(args), notification, {
            successMessage: "Tạo bot thành công",
            successDescription: "",
        });

    const updateBot = async (args: {
        botId: string;
        botToken: string;
        botUsername: string;
        note: string;
    }) =>
        notifyMutationResult(await updateMutation.mutateAsync(args), notification, {
            successMessage: "Cập nhật bot thành công",
            successDescription: "",
            errorMessage: "Lỗi khi cập nhật bot",
            errorDescription: "Đã xảy ra lỗi không xác định.",
        });

    const deleteBot = async (botId: string) =>
        notifyMutationResult(await deleteMutation.mutateAsync(botId), notification, {
            successMessage: "Xóa bot thành công",
            successDescription: "",
            errorMessage: "Lỗi khi xóa bot",
            errorDescription: "Đã xảy ra lỗi không xác định.",
        });

    const testBotConnection = async (botId: string) =>
        notifyMutationResult(await testMutation.mutateAsync(botId), notification, {
            successMessage: "Gửi tin nhắn test thành công",
            successDescription: "",
            errorMessage: "Lỗi khi gửi tin nhắn test",
            errorDescription: "Đã xảy ra lỗi không xác định.",
        });

    return {
        ...rest,
        createBot,
        updateBot,
        deleteBot,
        testBotConnection,
        isCreatingBot: createMutation.isPending,
        isUpdatingBot: updateMutation.isPending,
        isDeletingBot: deleteMutation.isPending,
        isTestingBot: testMutation.isPending,
    };
}

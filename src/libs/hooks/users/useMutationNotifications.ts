import { useEffect } from "react";

import { useAntdApp } from "@/libs/hooks/useAntdApp";

export function useQueryFetchErrorNotification(
    isError: boolean,
    error: Error | null | undefined,
    message: string,
    fallbackDescription = "Không thể kết nối đến máy chủ"
) {
    const { notification } = useAntdApp();

    useEffect(() => {
        if (!isError || !error) return;
        notification.error({
            message,
            description: error.message || fallbackDescription,
        });
    }, [isError, error, message, fallbackDescription, notification]);
}

interface ApiResult {
    status: boolean;
    message?: string;
}

export async function notifyMutationResult<T extends ApiResult>(
    result: T,
    notification: ReturnType<typeof useAntdApp>["notification"],
    options: {
        successMessage: string;
        successDescription?: string;
        errorMessage?: string;
        errorDescription?: string;
    }
): Promise<T> {
    if (!result.status) {
        notification.error({
            message: options.errorMessage ?? "Lỗi",
            description: result.message || options.errorDescription,
        });
        return result;
    }

    notification.success({
        message: options.successMessage,
        ...(options.successDescription ? { description: options.successDescription } : {}),
    });
    return result;
}

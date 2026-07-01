import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import {
    createBot,
    deleteBot,
    getBotsByTelegramAccount,
    testBotConnection,
    updateBot,
} from "@/libs/network/telegram.api";

const QUERY_KEY = "telegram-bots";

export function useTelegramBotQueries(telegramId: string, enabled: boolean) {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const queryKey = [QUERY_KEY, telegramId, page, limit, debouncedSearch] as const;

    const invalidateList = () =>
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY, telegramId] });

    const { data: response, isFetching, refetch, isError, error } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getBotsByTelegramAccount(telegramId, page, limit, debouncedSearch);
            if (!result.status) throw new Error(result.message);
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
            if (result.status) invalidateList();
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
            if (result.status) invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (botId: string) => deleteBot(telegramId, botId),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const testMutation = useMutation({
        mutationFn: (botId: string) => testBotConnection(telegramId, botId),
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
        isFetchError: isError,
        fetchError: error,
        createMutation,
        updateMutation,
        deleteMutation,
        testMutation,
    };
}

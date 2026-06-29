import { getLoginHistoryApi } from "@/libs/network/auth.api";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { useQuery } from "@tanstack/react-query";

export const useHistoryLoginHook = (page: number, limit: number, search: string) => {
    return useQuery({
        queryKey: ["history-login", page, limit, search],
        queryFn: () => getLoginHistoryApi(page, limit, search),
        ...NO_CACHE_QUERY_OPTIONS,
    });
};

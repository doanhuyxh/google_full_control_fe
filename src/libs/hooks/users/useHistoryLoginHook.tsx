import { getLoginHistoryApi } from "@/libs/network/auth.api";
import { useQuery } from "@tanstack/react-query";


export const useHistoryLoginHook = (page: number, limit: number, search: string) => {
    return useQuery({
        queryKey: ['history-login'],
        queryFn: () => getLoginHistoryApi(page, limit, search),
        enabled: !!page || !!limit || !!search,
    
    })
}
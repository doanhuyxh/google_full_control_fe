import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { CloudinaryDataFormData } from "@/libs/interfaces/cloudinaryData";
import {
    createCloudinaryAccount,
    deleteCloudinaryAccount,
    getAccountCloudinary,
    getCloudinaryUsage,
    updateCloudinaryAccount,
} from "@/libs/network/cloudinary.api";

const QUERY_KEY = "cloudinary-accounts";

export function useCloudinaryAccountQueries() {
    const queryClient = useQueryClient();
    const [pageCloudinary, setPageCloudinary] = useState<number>(1);
    const [limitCloudinary, setLimitCloudinary] = useState<number>(30);
    const [searchCloudinary, setSearchCloudinary] = useState<string>("");
    const debouncedSearch = useDebounce<string>(searchCloudinary, 600);

    const queryKey = [QUERY_KEY, pageCloudinary, limitCloudinary, debouncedSearch] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getAccountCloudinary(pageCloudinary, limitCloudinary, debouncedSearch);
            if (!result.status) throw new Error(result.message);
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (payload: CloudinaryDataFormData) => createCloudinaryAccount(payload),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CloudinaryDataFormData }) =>
            updateCloudinaryAccount(id, payload),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCloudinaryAccount(id),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const usageMutation = useMutation({
        mutationFn: (id: string) => getCloudinaryUsage(id),
    });

    return {
        accountData: response?.data?.items ?? [],
        loadingCloudinary: isFetching,
        fetchCloudinaryAccounts: refetch,
        pageCloudinary,
        setPageCloudinary,
        limitCloudinary,
        setLimitCloudinary,
        searchCloudinary,
        setSearchCloudinary,
        totalPagesCloudinary: response?.data?.pagination?.totalPages ?? 0,
        totalItemsCloudinary: response?.data?.pagination?.total ?? 0,
        createMutation,
        updateMutation,
        deleteMutation,
        usageMutation,
    };
}

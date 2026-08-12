import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { NO_CACHE_QUERY_OPTIONS } from "@/libs/hooks/queryOptions";
import { GoogleAccountCreateData } from "@/libs/interfaces/googleData";
import {
    createGoogleAccount,
    deleteGoogleAccount,
    getGoogleAccount,
    sendMailToOtherEmail,
    updateGoogleAccount,
} from "@/libs/network/google.api";

const QUERY_KEY = "google-accounts";

export function useGoogleAccountQueries() {
    const queryClient = useQueryClient();
    const [pageGoogle, setPageGoogle] = useState<number>(1);
    const [limitGoogle, setLimitGoogle] = useState<number>(30);
    const [statusGoogle, setStatusGoogle] = useState<string>("");
    const [searchGoogle, setSearchGoogle] = useState<string>("");
    const [resourcesUsedGoogle, setResourcesUsedGoogle] = useState<string>("");

    const queryKey = [QUERY_KEY, pageGoogle, limitGoogle, statusGoogle, searchGoogle, resourcesUsedGoogle] as const;

    const invalidateList = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

    const { data: response, isFetching, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getGoogleAccount(pageGoogle, limitGoogle, statusGoogle, searchGoogle, resourcesUsedGoogle);
            if (!result.status) throw new Error(result.message);
            return result;
        },
        ...NO_CACHE_QUERY_OPTIONS,
    });

    const createMutation = useMutation({
        mutationFn: (payload: GoogleAccountCreateData) => createGoogleAccount(payload),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, field, value }: { id: string; field: string; value: unknown }) =>
            updateGoogleAccount(id, field, value),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteGoogleAccount(id),
        onSuccess: (result) => {
            if (result.status) invalidateList();
        },
    });

    const sendEmailMutation = useMutation({
        mutationFn: ({
            fromAccountId,
            to,
            subject,
            message,
        }: {
            fromAccountId: string;
            to: string;
            subject: string;
            message: string;
        }) => sendMailToOtherEmail(fromAccountId, to, subject, message),
    });

    const updateGoogleField = async (id: string, field: string, value: unknown) => {
        if (value === undefined || value === null || value === "") return;
        return updateMutation.mutateAsync({ id, field, value });
    };

    return {
        accountData: response?.data?.items ?? [],
        loadingGoogle: isFetching,
        fetchGoogleAccounts: refetch,
        pageGoogle,
        setPageGoogle,
        limitGoogle,
        setLimitGoogle,
        statusGoogle,
        setStatusGoogle,
        searchGoogle,
        setSearchGoogle,
        totalPagesGoogle: response?.data?.pagination?.totalPages ?? 0,
        totalItemsGoogle: response?.data?.pagination?.total ?? 0,
        createMutation,
        updateMutation,
        deleteMutation,
        sendEmailMutation,
        updateGoogleField,
        resourcesUsedGoogle,
        setResourcesUsedGoogle,
    };
}

import { useCallback, useEffect, useState } from "react";
import { GoogleAccount } from "@/libs/intefaces/googleData";
import { getGoogleAccount } from "@/libs/api-client/google.api";
import { useDebounce } from "@/libs/hooks/useDebounce";

export function useGoogleAccount() {
    const [accountData, setAccountData] = useState<GoogleAccount[]>([]);
    const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
    const [pageGoogle, setPageGoogle] = useState<number>(1);
    const [limitGoogle, setLimitGoogle] = useState<number>(30);
    const [statusGoogle, setStatusGoogle] = useState<string>("");
    const [searchGoogle, setSearchGoogle] = useState<string>("");
    const [totalPagesGoogle, setTotalPagesGoogle] = useState<number>(0);
    const [totalItemsGoogle, setTotalItemsGoogle] = useState<number>(0);
    const debouncedSearch = useDebounce<string>(searchGoogle, 600);

    const fetchGoogleAccounts = useCallback(async () => {
        setLoadingGoogle(true);
        const response = await getGoogleAccount(pageGoogle, limitGoogle, statusGoogle, debouncedSearch);
        if (response.status) {
            setAccountData(response.data.accounts);
            setTotalPagesGoogle(response.data.pages);
            setTotalItemsGoogle(response.data.total);
        }
        setLoadingGoogle(false);
    }, [pageGoogle, limitGoogle, statusGoogle, debouncedSearch]);


    useEffect(() => {
        fetchGoogleAccounts();
    }, [fetchGoogleAccounts]);


    return {
        accountData,
        setAccountData,
        loadingGoogle,
        fetchGoogleAccounts,
        pageGoogle,
        setPageGoogle,
        limitGoogle,
        setLimitGoogle,
        statusGoogle,
        setStatusGoogle,
        searchGoogle,
        setSearchGoogle,
        totalPagesGoogle,
        totalItemsGoogle,
    };
}

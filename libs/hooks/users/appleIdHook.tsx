import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import AppleIdData from "@/libs/intefaces/appleIdData";
import { getAppleIDAccounts } from "@/libs/network/appleId.api";


export function useAppleIdHook() {
    const [accountData, setAccountData] = useState<AppleIdData[]>([]);
    const [loadingAppleId, setLoadingAppleId] = useState<boolean>(false);
    const [pageAppleId, setPageAppleId] = useState<number>(1);
    const [limitAppleId, setLimitAppleId] = useState<number>(30);
    const [searchAppleId, setSearchAppleId] = useState<string>("");
    const [totalPagesAppleId, setTotalPagesAppleId] = useState<number>(0);
    const [totalItemsAppleId, setTotalItemsAppleId] = useState<number>(0);
    const debouncedSearch = useDebounce<string>(searchAppleId, 600);

    const fetchAppleIdAccounts = useCallback(async () => {
        setLoadingAppleId(true);
        const response = await getAppleIDAccounts(pageAppleId, limitAppleId, debouncedSearch);
        if (response.status) {
            setAccountData(response.data.items);
            setTotalPagesAppleId(response.data.pagination.totalPages);
            setTotalItemsAppleId(response.data.pagination.total);
        }
        setLoadingAppleId(false);
    }, [pageAppleId, limitAppleId, debouncedSearch]);
    const removeAppleIdAccountById = (id: string) => {
        setAccountData((prevAccounts) => prevAccounts.filter((account) => account._id !== id));
    }

    const addAppleIdAccount = (newAccount: AppleIdData) => {
        setAccountData((prevAccounts) => [newAccount, ...prevAccounts]);
    }

    useEffect(() => {
        fetchAppleIdAccounts();
    }, [fetchAppleIdAccounts]);


    return {
        accountData,
        setAccountData,
        loadingAppleId,
        fetchAppleIdAccounts,
        pageAppleId,
        setPageAppleId,
        limitAppleId,
        setLimitAppleId,
        searchAppleId,
        setSearchAppleId,
        totalPagesAppleId,
        totalItemsAppleId,
        removeAppleIdAccountById,
        addAppleIdAccount,
    };
}

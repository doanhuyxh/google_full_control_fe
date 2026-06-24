import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import ZaloPersonalData from "@/libs/intefaces/zaloPersonal";
import { getZaloPersonalAccount } from "@/libs/network/zalo-personal.api";

export function useZaloPersonalAccount() {
    const [accountData, setAccountData] = useState<ZaloPersonalData[]>([]);
    const [loadingZaloPersonal, setLoadingZaloPersonal] = useState<boolean>(false);
    const [pageZaloPersonal, setPageZaloPersonal] = useState<number>(1);
    const [limitZaloPersonal, setLimitZaloPersonal] = useState<number>(30);
    const [searchZaloPersonal, setSearchZaloPersonal] = useState<string>("");
    const [totalPagesZaloPersonal, setTotalPagesZaloPersonal] = useState<number>(0);
    const [totalItemsZaloPersonal, setTotalItemsZaloPersonal] = useState<number>(0);
    const debouncedSearch = useDebounce<string>(searchZaloPersonal, 600);

    const fetchZaloPersonalAccounts = useCallback(async () => {
        setLoadingZaloPersonal(true);
        const response = await getZaloPersonalAccount(pageZaloPersonal, limitZaloPersonal, debouncedSearch);
        if (response.status) {
            setAccountData(response.data.items);
            setTotalPagesZaloPersonal(response.data.pagination.totalPages);
            setTotalItemsZaloPersonal(response.data.pagination.total);
        }
        setLoadingZaloPersonal(false);
    }, [pageZaloPersonal, limitZaloPersonal, debouncedSearch]);

    const removeZaloPersonalAccountById = (id: string) => {
        setAccountData((prevAccounts) => prevAccounts.filter((account) => account._id !== id));
    }

    const addZaloPersonalAccount = (newAccount: ZaloPersonalData) => {
        setAccountData((prevAccounts) => [newAccount, ...prevAccounts]);
    }
    
    const updateZaloPersonalAccount = (updatedAccount: ZaloPersonalData) => {
        setAccountData((prevAccounts) =>
            prevAccounts.map((account) =>
                account._id === updatedAccount._id ? updatedAccount : account
            )
        );
    }

    useEffect(() => {
        fetchZaloPersonalAccounts();
    }, [fetchZaloPersonalAccounts]);


    return {
        accountData,
        setAccountData,
        loadingZaloPersonal,
        fetchZaloPersonalAccounts,
        pageZaloPersonal,
        setPageZaloPersonal,
        limitZaloPersonal,
        setLimitZaloPersonal,
        searchZaloPersonal,
        setSearchZaloPersonal,
        totalPagesZaloPersonal,
        totalItemsZaloPersonal,
        removeZaloPersonalAccountById,
        addZaloPersonalAccount,
        updateZaloPersonalAccount,
    };
}

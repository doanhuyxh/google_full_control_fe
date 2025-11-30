import { useState } from "react";
import { GoogleAccount } from "@/libs/intefaces/googleData";
import { getGoogleAccount } from "@/libs/api-client/google.api";

export function useGoogleAccount() {
    const [accountData, setAccountData] = useState<GoogleAccount[]>([]);
    const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
    const [pageGoogle, setPageGoogle] = useState<number>(1);
    const [limitGoogle, setLimitGoogle] = useState<number>(30);
    const [statusGoogle, setStatusGoogle] = useState<string>("");
    const [searchGoogle, setSearchGoogle] = useState<string>("");
    const [totalPagesGoogle, setTotalPagesGoogle] = useState<number>(0);
    const [totalItemsGoogle, setTotalItemsGoogle] = useState<number>(0);

    const fetchGoogleAccounts = async () => {
        setLoadingGoogle(true);
        const response = await getGoogleAccount(pageGoogle, limitGoogle, statusGoogle, searchGoogle);
        if (response.status) {
            setAccountData(response.data.accounts);
            setTotalPagesGoogle(response.data.pages);
            setTotalItemsGoogle(response.data.total);
        }
        setLoadingGoogle(false);
    }

    const removeGoogleAccountById = (id: string) => {
        setAccountData((prevAccounts) => prevAccounts.filter((account) => account._id !== id));
    }

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
        removeGoogleAccountById,
    };
}

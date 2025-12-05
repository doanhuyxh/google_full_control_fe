import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/libs/hooks/useDebounce";
import { getAccountCloudinary } from "@/libs/api-client/cloudinary.api";
import { CloudinaryData } from "@/libs/intefaces/cloudinaryData";

export function useCloudinaryAccount() {
    const [accountData, setAccountData] = useState<CloudinaryData[]>([]);
    const [loadingCloudinary, setLoadingCloudinary] = useState<boolean>(false);
    const [pageCloudinary, setPageCloudinary] = useState<number>(1);
    const [limitCloudinary, setLimitCloudinary] = useState<number>(30);
    const [searchCloudinary, setSearchCloudinary] = useState<string>("");
    const [totalPagesCloudinary, setTotalPagesCloudinary] = useState<number>(0);
    const [totalItemsCloudinary, setTotalItemsCloudinary] = useState<number>(0);
    const debouncedSearch = useDebounce<string>(searchCloudinary, 600);

    const fetchCloudinaryAccounts = useCallback(async () => {
        setLoadingCloudinary(true);
        const response = await getAccountCloudinary(pageCloudinary, limitCloudinary, debouncedSearch);
        if (response.status) {
            setAccountData(response.data.items);
            setTotalPagesCloudinary(response.data.pagination.totalPages);
            setTotalItemsCloudinary(response.data.pagination.total);
        }
        setLoadingCloudinary(false);
    }, [pageCloudinary, limitCloudinary, debouncedSearch]);

    const removeCloudinaryAccountById = (id: string) => {
        setAccountData((prevAccounts) => prevAccounts.filter((account) => account._id !== id));
    }

    const addCloudinaryAccount = (newAccount: CloudinaryData) => {
        setAccountData((prevAccounts) => [newAccount, ...prevAccounts]);
    }

    useEffect(() => {
        fetchCloudinaryAccounts();
    }, [fetchCloudinaryAccounts]);


    return {
        accountData,
        setAccountData,
        loadingCloudinary,
        fetchCloudinaryAccounts,
        pageCloudinary,
        setPageCloudinary,
        limitCloudinary,
        setLimitCloudinary,
        searchCloudinary,
        setSearchCloudinary,
        totalPagesCloudinary,
        totalItemsCloudinary,
        removeCloudinaryAccountById,
        addCloudinaryAccount,
    };
}

import { useEffect, useState } from "react";

import RevapiData from "@/libs/intefaces/revapiData";
import { getRevapiData } from "@/libs/network/revapi.api";
import { useDebounce } from "../useDebounce";
import { useAntdApp } from "../useAntdApp";

export function useRevidApiAccount() {
    const [listRevidApiAccount, setListRevidApiAccount] = useState<RevapiData[]>([]);
    const [loadingRevidApi, setLoadingRevidApi] = useState<boolean>(false);
    const [pageRevidApi, setPageRevidApi] = useState<number>(1);
    const [limitRevidApi, setLimitRevidApi] = useState<number>(30);
    const [searchRevidApi, setSearchRevidApi] = useState<string>("");
    const [totalPagesRevidApi, setTotalPagesRevidApi] = useState<number>(0);
    const [totalItemsRevidApi, setTotalItemsRevidApi] = useState<number>(0);
    const debouncedSearch = useDebounce<string>(searchRevidApi, 600);
    const { notification } = useAntdApp();

    const fetchRevidApiAccounts = async () => {
        setLoadingRevidApi(true);
        const response = await getRevapiData(pageRevidApi, limitRevidApi, debouncedSearch);
        if (response.status) {
            setListRevidApiAccount(response.data.items);
            setTotalPagesRevidApi(response.data.pagination.totalPages);
            setTotalItemsRevidApi(response.data.pagination.total);
        } else {
            notification.error({
                message: "Lấy danh sách Revid API thất bại",
                description: response.message || "Không thể kết nối đến máy chủ",
            });
        }
        setLoadingRevidApi(false);
    };

    const removeRevidApiAccountById = (id: string) => {
        setListRevidApiAccount((prev) => prev.filter((account) => account._id !== id));
    };

    const updateRevidApiAccountLocal = (updatedAccount: RevapiData) => {
        setListRevidApiAccount((prev) =>
            prev.map((account) =>
                account._id === updatedAccount._id ? updatedAccount : account
            )
        );
    };

    const handleUpdateFieldLocal = (id: string, field: keyof RevapiData, value: string | number) => {
        setListRevidApiAccount((prev) =>
            prev.map((account) =>
                account._id === id ? { ...account, [field]: value } : account
            )
        );
    };

    useEffect(() => {
        fetchRevidApiAccounts();
    }, [debouncedSearch, pageRevidApi, limitRevidApi]);

    return {
        listRevidApiAccount,
        setListRevidApiAccount,
        loadingRevidApi,
        fetchRevidApiAccounts,
        pageRevidApi,
        setPageRevidApi,
        limitRevidApi,
        setLimitRevidApi,
        searchRevidApi,
        setSearchRevidApi,
        totalPagesRevidApi,
        totalItemsRevidApi,
        removeRevidApiAccountById,
        updateRevidApiAccountLocal,
        handleUpdateFieldLocal,
    };
}
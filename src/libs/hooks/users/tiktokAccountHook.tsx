import { useEffect, useState } from "react";
import TikTokAccountData from "@/libs/intefaces/tiktokData";
import { getTikTokAccount } from "@/libs/network/tiktok.api";
import { useDebounce } from "../useDebounce";
import { useAntdApp } from "../useAntdApp";

export function useTikTokAccount() {
    const [listTikTokAccount, setListTikTokAccount] = useState<TikTokAccountData[]>([]);
    const [loadingTikTok, setLoadingTikTok] = useState<boolean>(false);
    const [pageTikTok, setPageTikTok] = useState<number>(1);
    const [limitTikTok, setLimitTikTok] = useState<number>(30);
    const [searchTikTok, setSearchTikTok] = useState<string>("");
    const [totalPagesTikTok, setTotalPagesTikTok] = useState<number>(0);
    const [totalItemsTikTok, setTotalItemsTikTok] = useState<number>(0);
    const debouncedSearch = useDebounce<string>(searchTikTok, 600);
    const { notification } = useAntdApp();

    const fetchTikTokAccounts = async () => {
        setLoadingTikTok(true);
        const response = await getTikTokAccount(pageTikTok, limitTikTok, debouncedSearch);
        if (response.status) {
            setListTikTokAccount(response.data.items);
            setTotalPagesTikTok(response.data.pagination.totalPages);
            setTotalItemsTikTok(response.data.pagination.total);
        } else {
            notification.error({
                message: "Lấy danh sách tài khoản TikTok thất bại",
                description: response.message || "Không thể kết nối đến máy chủ",
            });
        }
        setLoadingTikTok(false);
    };

    const removeTikTokAccountById = (id: string) => {
        setListTikTokAccount((prev) => prev.filter((account) => account._id !== id));
    };

    const addTikTokAccount = (newAccount: TikTokAccountData) => {
        setListTikTokAccount((prev) => [newAccount, ...prev]);
    };

    const updateTikTokAccountLocal = (updatedAccount: TikTokAccountData) => {
        setListTikTokAccount((prev) =>
            prev.map((account) =>
                account._id === updatedAccount._id ? updatedAccount : account
            )
        );
    };

    const handleUpdateFieldLocal = (id: string, field: keyof TikTokAccountData, value: any) => {
        setListTikTokAccount((prev) =>
            prev.map((account) =>
                account._id === id ? { ...account, [field]: value } : account
            )
        );
    };

    useEffect(() => {
        fetchTikTokAccounts();
    }, [debouncedSearch, pageTikTok, limitTikTok]);

    return {
        listTikTokAccount,
        setListTikTokAccount,
        loadingTikTok,
        fetchTikTokAccounts,
        pageTikTok,
        setPageTikTok,
        limitTikTok,
        setLimitTikTok,
        searchTikTok,
        setSearchTikTok,
        totalPagesTikTok,
        totalItemsTikTok,
        removeTikTokAccountById,
        addTikTokAccount,
        updateTikTokAccountLocal,
        handleUpdateFieldLocal,
    };
}

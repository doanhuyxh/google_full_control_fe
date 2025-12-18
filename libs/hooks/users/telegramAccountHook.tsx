import { useEffect, useState } from "react";
import {TelegramAccountData} from "@/libs/intefaces/telegramData";
import { getTelegramAccounts } from "@/libs/api-client/telegram.api";
import { useDebounce } from "../useDebounce";
import { useAntdApp } from "../useAntdApp";


export function useTelegramAccount() {
    const [listTelegramAccount, setListTelegramAccount] = useState<TelegramAccountData[]>([]);
    const [loadingTele, setLoadingTele] = useState<boolean>(false);
    const [pageTele, setPageTele] = useState<number>(1);
    const [limitTele, setLimitTele] = useState<number>(30);
    const [searchTele, setSearchTele] = useState<string>("");
    const [totalPagesTele, setTotalPagesTele] = useState<number>(0);
    const [totalItemsTele, setTotalItemsTele] = useState<number>(0);
    const debouncedSearch = useDebounce<string>(searchTele, 600);
    const {notification} = useAntdApp();

    const fetchTelegramAccounts = async () => {
        setLoadingTele(true);
        const response = await getTelegramAccounts(pageTele, limitTele, debouncedSearch);
        if (response.status) {
            setListTelegramAccount(response.data.items);
            setTotalPagesTele(response.data.pagination.totalPages);
            setTotalItemsTele(response.data.pagination.total);
        }else{
            notification.error({
                message: 'Lấy danh sách tài khoản Telegram thất bại',
                description: response.message || 'Không thể kết nối đến máy chủ',
            });
        }
        setLoadingTele(false);
    }

    const removeTelegramAccountById = (id: string) => {
        setListTelegramAccount((prevAccounts) => prevAccounts.filter((account) => account._id !== id));
    }

    const addTelegramAccount = (newAccount: TelegramAccountData) => {
        setListTelegramAccount((prevAccounts) => [newAccount, ...prevAccounts]);
    }

    const updateTelegramAccount = (updatedAccount: TelegramAccountData) => {
        setListTelegramAccount((prevAccounts) =>
            prevAccounts.map((account) =>
                account._id === updatedAccount._id ? updatedAccount : account
            )
        );
    }

    useEffect(() => {
        fetchTelegramAccounts();
    }, [debouncedSearch, pageTele, limitTele]);

    return {
        listTelegramAccount,
        setListTelegramAccount,
        loadingTele,
        fetchTelegramAccounts,
        pageTele,
        setPageTele,
        limitTele,
        setLimitTele,
        searchTele,
        setSearchTele,
        totalPagesTele,
        totalItemsTele,
        removeTelegramAccountById,
        addTelegramAccount,
        updateTelegramAccount,
    };
}
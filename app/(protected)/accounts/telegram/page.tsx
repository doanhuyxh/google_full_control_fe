import { Suspense } from "react";
import TelegramComponent from "@/components/features/telegram";

export const metadata = {
    title: 'Quản lý tài khoản Telegram',
    description: 'Trang quản lý tài khoản Telegram cá nhân và bot Telegram.',
};

export default function TelegramAccountsPage() {
    return (
        <Suspense fallback={<div>Loading Telegram Accounts...</div>}>
            <TelegramComponent />
        </Suspense>
    );
}
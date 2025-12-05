import { Suspense } from "react";
import ZaloPersonalListAccountComponent from "@/components/features/zalo-personal/list-zalo-account";

export const metadata = {
    title: "Zalo Cá nhân - Quản lý tài khoản",
};

export default function ZaloPersonalAccountPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ZaloPersonalListAccountComponent />
        </Suspense>
    );
}
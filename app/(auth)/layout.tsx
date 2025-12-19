import { ReactNode, Suspense } from "react";
import AntdLayoutGuest from "@/components/layout/Guest";

export default async function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <AntdLayoutGuest >
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </AntdLayoutGuest>
    )
}
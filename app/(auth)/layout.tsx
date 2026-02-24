import { ReactNode } from "react";
import AntdLayoutGuest from "@/components/layout/Guest";

export default async function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <AntdLayoutGuest >
            {children}
        </AntdLayoutGuest>
    )
}
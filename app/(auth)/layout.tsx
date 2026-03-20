import { ReactNode } from "react";
import AntdLayoutGuest from "@/components/layout/Guest";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default async function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <AntdRegistry>
            <AntdLayoutGuest >
                {children}
            </AntdLayoutGuest>
        </AntdRegistry>
    )
}
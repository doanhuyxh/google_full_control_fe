import { cookies } from "next/headers";
import { ReactNode } from "react";
import AntdLayout from "@/components/layout/Protected";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const theme = cookieStore.get("theme")?.value || "light";
    return (
        <AntdLayout initialTheme={theme}>
            {children}
        </AntdLayout>
    )
}
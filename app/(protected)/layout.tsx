import { cookies } from "next/headers";
import { ReactNode, Suspense } from "react";
import AntdLayout from "@/components/layout/Protected";
import ReduxProvider from "@/libs/redux/ReduxProvider";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const theme = cookieStore.get("theme")?.value || "light";
    return (
        <ReduxProvider>
            <AntdLayout initialTheme={theme}>
                <Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Suspense>
            </AntdLayout>
        </ReduxProvider>
    )
}
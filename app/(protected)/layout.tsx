import { ReactNode, Suspense } from "react";
import AntdLayout from "@/components/layout/antd_layout";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AntdLayout>
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </AntdLayout>
    )
}
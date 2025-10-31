import { ReactNode, Suspense } from "react";
import NextTopLoader from 'nextjs-toploader'
import AntdLayout from "@/components/layout/antd_layout";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AntdLayout>
            <NextTopLoader
                color="#29d"
                initialPosition={0.08}
                crawlSpeed={200}
                height={5}
                crawl={true}
                showSpinner={true}
                easing="ease"
                speed={200}
            />
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </AntdLayout>
    )
}
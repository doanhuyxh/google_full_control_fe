"use client";
import NextTopLoader from "nextjs-toploader";
import { ReactNode, Suspense } from "react";
import { ConfigProvider, Layout, App, Spin } from "antd";
import "@ant-design/v5-patch-for-react-19";
import { AntdRegistry } from "@ant-design/nextjs-registry";


export default function AntdLayoutGuest({ children }: { children: ReactNode }) {
    return (
        <>
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
            <AntdRegistry>
                <ConfigProvider>
                    <Layout style={{ minHeight: "100vh" }}>
                        <Layout style={{ flexDirection: "column" }}>
                            <App
                                message={{
                                    top: 80,
                                    duration: 5,
                                    maxCount: 10,
                                }}
                                notification={{
                                    placement: "topRight",
                                    duration: 4,
                                    maxCount: 10,
                                }}
                            >
                                <Suspense fallback={<Spin size="large" className="m-20" />}>
                                    <Layout.Content>{children}</Layout.Content>
                                </Suspense>
                            </App>
                        </Layout>
                    </Layout>
                </ConfigProvider>
            </AntdRegistry>
        </>
    );
}

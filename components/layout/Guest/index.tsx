"use client";
import { ReactNode, Suspense } from "react";
import { ConfigProvider, Layout, App, Spin } from "antd";
import "@ant-design/v5-patch-for-react-19";


export default function AntdLayoutGuest({ children }: { children: ReactNode }) {
    return (
        <>
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
        </>
    );
}

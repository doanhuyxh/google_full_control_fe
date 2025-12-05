"use client";
import NextTopLoader from "nextjs-toploader";
import { ReactNode, Suspense } from "react";
import { ConfigProvider, Layout, App, Spin } from "antd";
import "@ant-design/v5-patch-for-react-19";
import vi_VN from 'antd/locale/vi_VN';
import { AntdRegistry } from "@ant-design/nextjs-registry";
import antdConfig from "@/libs/constants/antd_config";
import SideNav from "./SideNav";
import AppHeader from "./Header";

export default function AntdLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <NextTopLoader color="#29d" height={5} crawl showSpinner />
            <AntdRegistry>
                <ConfigProvider locale={vi_VN} theme={antdConfig}>
                    <Layout style={{ minHeight: "100vh" }}>
                        <SideNav />
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
                                    <AppHeader />
                                    <Layout.Content
                                        style={{
                                            padding: 16,
                                            background: "#fff",
                                            flex: 1,
                                            overflow: "auto",
                                        }}
                                    >
                                        {children}
                                    </Layout.Content>
                                </Suspense>
                            </App>
                        </Layout>
                    </Layout>
                </ConfigProvider>
            </AntdRegistry>
        </>
    );
}

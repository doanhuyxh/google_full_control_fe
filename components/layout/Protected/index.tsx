"use client";
import NextTopLoader from "nextjs-toploader";
import { ReactNode, Suspense, useState } from "react";
import { ConfigProvider, Layout, App, Spin, theme as antdTheme, ThemeConfig } from "antd";
import "@ant-design/v5-patch-for-react-19";
import vi_VN from 'antd/locale/vi_VN';
import { AntdRegistry } from "@ant-design/nextjs-registry";
import SideNav from "./SideNav";
import AppHeader from "./Header";
import { antdComponentConfig } from "@/libs/constants/colors";

export default function AntdLayout({ children, initialTheme }: { children: ReactNode, initialTheme: string }) {
    const [isDark, setIsDark] = useState(initialTheme === "dark");
    const dynamicConfig: ThemeConfig = {
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        components: {
            ...antdComponentConfig
        }
    };

    return (
        <>
            <NextTopLoader color="red" height={5} crawl showSpinner />
            <AntdRegistry>
                <ConfigProvider locale={vi_VN} theme={dynamicConfig}>
                    <Layout style={{ minHeight: "100vh" }}>
                        <SideNav/>
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
                                    <AppHeader isDark={isDark} onToggleTheme={setIsDark} />
                                    <Layout.Content
                                        style={{
                                            padding: 16,
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

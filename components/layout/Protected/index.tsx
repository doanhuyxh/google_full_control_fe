"use client";
import NextTopLoader from "nextjs-toploader";
import { ReactNode, useEffect, useState } from "react";
import { ConfigProvider, Layout, App, Grid, theme as antdTheme, ThemeConfig } from "antd";
import "@ant-design/v5-patch-for-react-19";
import vi_VN from 'antd/locale/vi_VN';
import { AntdRegistry } from "@ant-design/nextjs-registry";
import SideNav from "./SideNav";
import AppHeader from "./Header";
import { antdComponentConfig } from "@/libs/constants/colors";

export default function AntdLayout({ children, initialTheme }: { children: ReactNode, initialTheme: string }) {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const [isDark, setIsDark] = useState(initialTheme === "dark");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        if (isMobile) {
            setIsCollapsed(true);
        }
    }, [isMobile]);

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
                    <App
                        message={{
                            top: 80,
                            duration: 3,
                            maxCount: 10,
                        }}
                        notification={{
                            placement: "bottomRight",
                            duration: 3,
                            maxCount: 10,
                            showProgress: true,
                        }}
                    >
                        <Layout style={{ minHeight: "100vh" }}>
                            <SideNav
                                isMobile={isMobile}
                                mobileOpen={mobileNavOpen}
                                onMobileClose={() => setMobileNavOpen(false)}
                                collapsed={isCollapsed}
                                onCollapsedChange={setIsCollapsed}
                            />
                            <Layout style={{ flexDirection: "column", maxHeight: "100vh" }}>


                                <AppHeader
                                    isDark={isDark}
                                    isMobile={isMobile}
                                    onOpenMobileMenu={() => setMobileNavOpen(true)}
                                    onToggleTheme={setIsDark}
                                />
                                <Layout.Content
                                    style={{
                                        padding: isMobile ? 12 : 16,
                                        flex: 1,
                                        overflow: "auto",
                                    }}
                                >
                                    {children}
                                </Layout.Content>
                            </Layout>
                        </Layout>
                    </App>
                </ConfigProvider >
            </AntdRegistry >
        </>
    );
}

"use client";
import { ReactNode, useState } from "react";
import { Layout, Grid } from "antd";

import SideNav from "./SideNav";
import AppHeader from "./Header";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);


    return (
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
                    isMobile={isMobile}
                    onOpenMobileMenu={() => setMobileNavOpen(true)}
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
    );
}

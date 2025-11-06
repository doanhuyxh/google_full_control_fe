"use client";

import { useLayoutEffect, useEffect, useMemo, useState } from "react";
import { Layout, Menu, Skeleton } from "antd";
import {
    AppstoreOutlined,
    SettingOutlined,
    DashboardOutlined,
    DatabaseOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;

const menuItems = [
    {
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "Tổng quan",
    },
    {
        key: "/accounts",
        icon: <AppstoreOutlined />,
        label: "Tài khoản",
        children: [
            {
                key: "/accounts/github",
                label: "GitHub",
                icon: <DatabaseOutlined />,
            },
            {
                key: "/accounts/google",
                label: "Google",
                icon: <DatabaseOutlined />,
            },
        ],
    },
    {
        key: "/data",
        icon: <DatabaseOutlined />,
        label: "Dữ liệu",
        children: [
            {
                key: "/data/source",
                label: "Nguồn dữ liệu",
                children: [
                    {
                        key: "/data/source/api",
                        label: "API",
                    },
                    {
                        key: "/data/source/file",
                        label: "File Upload",
                    },
                ],
            },
        ],
    },
    {
        key: "/settings",
        icon: <SettingOutlined />,
        label: "Cài đặt",
    },
];

export default function SideNav() {
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const findOpenKeys = (path: string, items: any[]): string[] => {
        for (const item of items) {
            if (item.children) {
                if (item.children.some((c: any) => c.key === path)) {
                    return [item.key];
                }
                const deeper = findOpenKeys(path, item.children);
                if (deeper.length) return [item.key, ...deeper];
            }
        }
        return [];
    };

    const openKeys = useMemo(() => findOpenKeys(pathname, menuItems), [pathname]);

    useEffect(() => {
        const handleResize = () => setCollapsed(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [pathname]);

    useLayoutEffect(() => {
        setIsMounted(true);
    }, []);

    // Loading skeleton với kích thước giống như khi đã render
    if (!isMounted) {
        return (
            <div className="w-fit h-screen">
                <Sider
                    collapsed={collapsed}
                    width={260}
                    className="h-screen shadow-lg"
                >
                    <div className="flex items-center justify-center h-16 border-b">
                        <Skeleton.Avatar active size="small" />
                    </div>
                    <div className="p-4 space-y-3">
                        <Skeleton active paragraph={{ rows: 1, width: '80%' }} title={false} />
                        <Skeleton active paragraph={{ rows: 1, width: '90%' }} title={false} />
                        <Skeleton active paragraph={{ rows: 1, width: '70%' }} title={false} />
                        <Skeleton active paragraph={{ rows: 1, width: '85%' }} title={false} />
                    </div>
                </Sider>
            </div>
        );
    }

    return (
        <div className="w-fit h-screen">
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={260}
                className="h-screen shadow-lg"
            >
                <div className="flex items-center justify-center h-16 border-b text-lg font-semibold">
                    {!collapsed ? "MyApp" : "🧭"}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    defaultOpenKeys={openKeys}
                    items={menuItems}
                    onClick={({ key }) => router.push(key)}
                    className="border-none mt-2"
                />
            </Sider>
        </div>
    );
}

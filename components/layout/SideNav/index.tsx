"use client";

import { useEffect, useMemo, useState } from "react";
import { Layout, Menu } from "antd";
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

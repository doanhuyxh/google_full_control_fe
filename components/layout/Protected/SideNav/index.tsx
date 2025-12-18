"use client";

import { useLayoutEffect, useEffect, useState } from "react";
import { Layout, Menu, Skeleton, theme } from "antd";
import {
    AppstoreOutlined,
    SettingOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    FolderAddFilled
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { BookTemplateIcon, Mail, MessageCircle } from "lucide-react";

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
                key: "/accounts/google",
                label: "Google",
                icon: <DatabaseOutlined />,
                children: [
                    {
                        key: "/accounts/google/list",
                        label: "Danh sách tài khoản",
                        icon: <Mail />,
                    },
                    {
                        key: "/accounts/google/template-mail",
                        label: "Mẫu mail",
                        icon: <BookTemplateIcon />,
                    },
                ]
            },
            {
                key: "/accounts/zalo-personal",
                label: "Zalo Cá nhân",
                icon: <MessageCircle size={16} />,
            },
            {
                key: "/accounts/cloudinary",
                label: "Cloudinary",
                icon: <FolderAddFilled />,
            },
            {
                key: "/accounts/telegram",
                label: "Telegram",
                icon: <MessageCircle size={16} />,
            }
        ],
    },
    {
        key: "/devices",
        icon: <DatabaseOutlined />,
        label: "Thiết bị đăng nhập",
    },
    {
        key: "/settings",
        icon: <SettingOutlined />,
        label: "Cài đặt",
    }
];

export default function SideNav() {
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const { token } = theme.useToken();

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

    useEffect(() => {
        const keys = findOpenKeys(pathname, menuItems);
        setOpenKeys(keys);
    }, [pathname]);

    useEffect(() => {
        const handleResize = () => setCollapsed(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useLayoutEffect(() => {
        setIsMounted(true);
    }, []);

    // ⏳ Skeleton chờ mount
    if (!isMounted) {
        return (
            <div className="w-fit h-screen">
                <div className="p-4 space-y-3">
                    <Skeleton active paragraph={{ rows: 1, width: '80%' }} title={false} />
                    <Skeleton active paragraph={{ rows: 1, width: '90%' }} title={false} />
                    <Skeleton active paragraph={{ rows: 1, width: '70%' }} title={false} />
                    <Skeleton active paragraph={{ rows: 1, width: '85%' }} title={false} />
                </div>
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
                style={{
                    backgroundColor: token.colorBgContainer,
                    color: token.colorText,
                    borderColor: token.colorBorderSecondary,
                }}
                className="h-screen shadow-lg"
            >
                <div className="flex items-center justify-center h-12 border-b text-lg font-semibold">
                    {!collapsed ? "Google Full Control" : "GFC"}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    openKeys={openKeys}
                    onOpenChange={setOpenKeys}
                    items={menuItems}
                    onClick={({ key }) => router.push(key)}
                    className="border-none mt-2"
                />
            </Sider>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Layout, Switch, Dropdown, Avatar, MenuProps, Space, Button, theme } from "antd";
import { MoonOutlined, SunOutlined, UserOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
const { Header } = Layout;

export default function AppHeader({
    onToggleTheme,
    isDark,
    isMobile,
    onOpenMobileMenu,
}: {
    onToggleTheme?: (value: boolean) => void;
    isDark?: boolean;
    isMobile?: boolean;
    onOpenMobileMenu?: () => void;
}) {
    const { token } = theme.useToken();
    const [menuOpen, setMenuOpen] = useState(false);
    const [localDark, setLocalDark] = useState(isDark || false);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const itemsProfile: MenuProps["items"] = [
        {
            key: "profile",
            label: "Hồ sơ cá nhân",
            icon: <UserOutlined />,
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            label: "Đăng xuất",
            className: "text-red-600!",
            icon: <LogoutOutlined />,
            onClick: () => {
                window.location.href = "/logout";
            },
        },
    ];

    const handleTongleDarkMode = () => {
        onToggleTheme?.(!localDark);
        setLocalDark(!localDark);
        document.cookie = `theme=${!localDark ? "dark" : "light"}; path=/; max-age=31536000`;
    }

    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                backgroundColor: token.colorBgContainer,
                height: "unset",
                lineHeight: "unset",
                paddingInline: isMobile ? 12 : 16,
            }}
            className="min-h-12!"
        >
            <div className="flex items-center gap-2">
                {isMobile ? (
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={onOpenMobileMenu}
                        aria-label="Mở menu"
                    />
                ) : null}
            </div>
            <Space align="center" size="small" style={{ height: "unset", lineHeight: "unset" }}>
                {!isMobile && (
                    <span className="text-xs font-mono opacity-70 select-none mr-1">
                        {now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                )}
                <Switch
                    size="small"
                    checkedChildren={<SunOutlined />}
                    unCheckedChildren={<MoonOutlined />}
                    checked={!localDark}
                    onChange={handleTongleDarkMode}
                />
                <Dropdown
                    menu={{ items: itemsProfile }}
                    placement="bottomRight"
                    trigger={["click"]}
                    open={menuOpen}
                    onOpenChange={setMenuOpen}
                >
                    <Avatar
                        size="small"
                        style={{ backgroundColor: "#1677ff", cursor: "pointer" }}
                    >
                        N
                    </Avatar>
                </Dropdown>
            </Space>
        </Header>
    );
}

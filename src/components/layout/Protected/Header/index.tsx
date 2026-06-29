"use client";

import { useEffect, useState } from "react";
import { Layout, Switch, Dropdown, Avatar, MenuProps, Space, Button, theme } from "antd";
import { MoonOutlined, SunOutlined, UserOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import RealTimeClock from "@/components/common/RealTimeClock";

const { Header } = Layout;

const THEME_COOKIE_MAX_AGE = 31536000;

function getThemeFromCookie(): "light" | "dark" {
    const match = document.cookie.match(/(?:^|;\s*)theme=(light|dark)(?:;|$)/);
    return match?.[1] === "dark" ? "dark" : "light";
}

function applyTheme(nextTheme: "light" | "dark") {
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.cookie = `theme=${nextTheme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}`;
}

export default function AppHeader({
    isMobile,
    onOpenMobileMenu,
}: {
    isMobile?: boolean;
    onOpenMobileMenu?: () => void;
}) {
    const { token } = theme.useToken();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(
        () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
    );

    useEffect(() => {
        const savedTheme = getThemeFromCookie();
        applyTheme(savedTheme);
        setIsDark(savedTheme === "dark");
    }, []);


    const itemsProfile: MenuProps["items"] = [
        {
            key: "profile",
            label: "Hồ sơ cá nhân",
            icon: <UserOutlined />,
            onClick: () => {
                window.location.href = "/profile";
            }
        },
        {
            type: "divider",
        },
        {
            key: "devices",
            label: "Lịch sử đăng nhập",
            icon: <UserOutlined />,
            onClick: () => {
                window.location.href = "/devices";
            }
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

    const handleToggleDarkMode = (checked: boolean) => {
        const nextTheme = checked ? "light" : "dark";
        applyTheme(nextTheme);
        setIsDark(nextTheme === "dark");
    };

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
                <RealTimeClock />
                <Switch
                    size="small"
                    checkedChildren={<SunOutlined />}
                    unCheckedChildren={<MoonOutlined />}
                    checked={!isDark}
                    onChange={handleToggleDarkMode}
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

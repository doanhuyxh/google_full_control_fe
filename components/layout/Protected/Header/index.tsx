"use client";

import { useState } from "react";
import { Layout, Switch, Dropdown, Avatar, MenuProps, Space } from "antd";
import { MoonOutlined, SunOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
const { Header } = Layout;

export default function AppHeader({
    onToggleTheme,
    isDark,
}: {
    onToggleTheme?: (value: boolean) => void;
    isDark?: boolean;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [localDark, setLocalDark] = useState(isDark || false);

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
                borderBottom: "1px solid #f0f0f0",
                backgroundColor: "#353f78",
                height:"unset",
                lineHeight:"unset",
            }}
            className="h-12!"
        >
            <div/>
            <Space align="center" size="small" style={{ height: "unset", lineHeight: "unset" }}>
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

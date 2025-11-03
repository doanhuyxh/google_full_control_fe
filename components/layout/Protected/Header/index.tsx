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

    const items: MenuProps["items"] = [
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
            icon: <LogoutOutlined />,
            onClick: () => {
                window.location.href = "/logout";
            },
        },
    ];

    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                height: 64,
                borderBottom: "1px solid #f0f0f0",
            }}
        >
            <div />
            <Space align="center" size="middle">
                <Switch
                    checkedChildren={<SunOutlined />}
                    unCheckedChildren={<MoonOutlined />}
                    checked={!isDark}
                    onChange={() => onToggleTheme?.(!isDark)}
                />
                <Dropdown
                    menu={{ items }}
                    placement="bottomRight"
                    trigger={["click"]}
                    open={menuOpen}
                    onOpenChange={setMenuOpen}
                >
                    <Avatar
                        size="large"
                        style={{ backgroundColor: "#1677ff", cursor: "pointer" }}
                    >
                        N
                    </Avatar>
                </Dropdown>
            </Space>
        </Header>
    );
}

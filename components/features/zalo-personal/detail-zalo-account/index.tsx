"use client";

import { useEffect, useState } from "react";
import GroupListZaloAccount from "./groups/index";
import FriendListZaloAccount from "./friends/index";
import useSearchParamsClient from "@/libs/hooks/useSearchParamsClient";
import { Tabs, type TabsProps, Row, Col, Card, Badge, Button, Space } from "antd";
import MessageChatZaloAccount from "./message-chat";
import BreadcrumbComponent from "@/components/breadcrumb";
import useLocalStorage from "@/libs/hooks/useLocalStorage";
import { ZaloLoginInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { ReloadOutlined } from "@ant-design/icons";

interface DetailZaloAccountProps {
    id: string;
}

export default function DetailZaloAccount({ id }: DetailZaloAccountProps) {
    const [mounted, setMounted] = useState(false);
    const [tab, setTab] = useSearchParamsClient<string>("tab", "groups");
    const [zaloInfo] = useLocalStorage<ZaloLoginInfo | null>("zaloInfoDetail", null);
    const [groupCount, setGroupCount] = useState(0);
    const [friendCount, setFriendCount] = useState(0);
    const [groupReloadSignal, setGroupReloadSignal] = useState(0);
    const [friendReloadSignal, setFriendReloadSignal] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    const items: TabsProps["items"] = [
        {
            key: "groups",
            label: (
                <Space size={6}>
                    <span>Nhóm</span>
                    <Badge count={groupCount} showZero overflowCount={999999} />
                </Space>
            ),
            children: <GroupListZaloAccount id={id} reloadSignal={groupReloadSignal} onCountChange={setGroupCount} />,
        },
        {
            key: "friends",
            label: (
                <Space size={6}>
                    <span>Bạn bè</span>
                    <Badge count={friendCount} showZero overflowCount={999999} />
                </Space>
            ),
            children: <FriendListZaloAccount id={id} reloadSignal={friendReloadSignal} onCountChange={setFriendCount} />,
        },
    ];

    const handleReloadCurrentTab = () => {
        if (tab === "friends") {
            setFriendReloadSignal((prev) => prev + 1);
            return;
        }

        setGroupReloadSignal((prev) => prev + 1);
    };

    return (
        <div className="flex h-full flex-col gap-2">
            {mounted && (
                <BreadcrumbComponent
                    array={[
                        { title: "Zalo cá nhân", href: "/accounts/zalo-personal" },
                        { title: zaloInfo?.info?.name || "Chi tiết tài khoản", href: "" },
                    ]}
                />
            )}
            <Card className="flex-1">
                <Row gutter={16} className="h-full">
                    <Col span={8} className="h-full">
                        <Tabs
                            activeKey={tab}
                            onChange={(key) => setTab(key)}
                            items={items}
                            tabBarExtraContent={{
                                right: (
                                    <Button
                                        icon={<ReloadOutlined />}
                                        onClick={handleReloadCurrentTab} />
                                ),
                            }}
                        />
                    </Col>
                    <Col span={16} className="h-full">
                        <MessageChatZaloAccount accountId={id} />
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

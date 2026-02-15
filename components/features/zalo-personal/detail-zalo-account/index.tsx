"use client";

import { useEffect, useState } from "react";
import GroupListZaloAccount from "./groups/index";
import FriendListZaloAccount from "./friends/index";
import useSearchParamsClient from "@/libs/hooks/useSearchParamsClient";
import { Tabs, type TabsProps, Row, Col, Card } from "antd";
import MessageChatZaloAccount from "./message-chat";
import BreadcrumbComponent from "@/components/breadcrumb";
import useLocalStorage from "@/libs/hooks/useLocalStorage";
import { ZaloLoginInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";

interface DetailZaloAccountProps {
    id: string;
}

export default function DetailZaloAccount({ id }: DetailZaloAccountProps) {
    const [mounted, setMounted] = useState(false);
    const [tab, setTab] = useSearchParamsClient<string>("tab", "groups");
    const [zaloInfo] = useLocalStorage<ZaloLoginInfo | null>("zaloInfoDetail", null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const items: TabsProps["items"] = [
        {
            key: "groups",
            label: "Nhóm",
            children: <GroupListZaloAccount id={id} />,
        },
        {
            key: "friends",
            label: "Bạn bè",
            children: <FriendListZaloAccount id={id} />,
        },
    ];

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
                    <Col span={12} className="h-full">
                        <Tabs activeKey={tab} onChange={(key) => setTab(key)} items={items} />
                    </Col>
                    <Col span={12} className="h-full">
                        <MessageChatZaloAccount accountId={id} />
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

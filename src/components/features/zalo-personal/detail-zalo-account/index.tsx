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
import { useAppDispatch, useAppSelector } from "@/libs/redux/hooks";
import {
    setActiveTab,
    setFriendCount,
    setGroupCount,
    triggerFriendReload,
    triggerGroupReload,
    type ZaloDetailTab,
} from "@/libs/redux/slices/zaloDetail.slice";

interface DetailZaloAccountProps {
    id: string;
}

export default function DetailZaloAccount({ id }: DetailZaloAccountProps) {
    const dispatch = useAppDispatch();
    const [mounted, setMounted] = useState(false);
    const [searchTab, setSearchTab] = useSearchParamsClient<string>("tab", "groups");
    const [zaloInfo] = useLocalStorage<ZaloLoginInfo | null>("zaloInfoDetail", null);
    const { activeTab, groupCount, friendCount, groupReloadSignal, friendReloadSignal } = useAppSelector(
        (state) => state.zaloDetail
    );
    const currentTab: ZaloDetailTab = searchTab === "friends" ? "friends" : "groups";

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (currentTab !== activeTab) {
            dispatch(setActiveTab(currentTab));
        }
    }, [activeTab, currentTab, dispatch]);

    const items: TabsProps["items"] = [
        {
            key: "groups",
            label: (
                <Space size={6}>
                    <span>Nhóm</span>
                    <Badge count={groupCount} showZero overflowCount={999999} />
                </Space>
            ),
            children: (
                <GroupListZaloAccount
                    id={id}
                    reloadSignal={groupReloadSignal}
                    onCountChange={(count) => dispatch(setGroupCount(count))}
                />
            ),
        },
        {
            key: "friends",
            label: (
                <Space size={6}>
                    <span>Bạn bè</span>
                    <Badge count={friendCount} showZero overflowCount={999999} />
                </Space>
            ),
            children: (
                <FriendListZaloAccount
                    id={id}
                    reloadSignal={friendReloadSignal}
                    onCountChange={(count) => dispatch(setFriendCount(count))}
                />
            ),
        },
    ];

    const handleReloadCurrentTab = () => {
        if (currentTab === "friends") {
            dispatch(triggerFriendReload());
            return;
        }

        dispatch(triggerGroupReload());
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
                            activeKey={currentTab}
                            onChange={(key) => {
                                const nextTab: ZaloDetailTab = key === "friends" ? "friends" : "groups";
                                setSearchTab(nextTab);
                            }}
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

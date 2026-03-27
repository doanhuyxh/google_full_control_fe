"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Descriptions, Space, Spin, Tag, Typography } from "antd";

import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { getProfileApi, updateApiKeyApi } from "@/libs/network/auth.api";
import { UserProfile } from "@/libs/intefaces/authData";
import { formatUtcToLocal } from "@/libs/utils/timeUtils";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function formatDateValue(value: Date | string) {
    return formatUtcToLocal(String(value));
}

export default function ProfileComponent() {
    const { notification } = useAntdApp();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isUpdatingApiKey, setIsUpdatingApiKey] = useState(false);

    const loadProfile = useCallback(async () => {
        setIsLoadingProfile(true);
        try {
            const response = await getProfileApi();
            if (!response.status) {
                notification.error({
                    message: "Không thể tải thông tin hồ sơ",
                    description: response.message || "Vui lòng thử lại sau.",
                });
                return;
            }

            setProfile(response.data);
        } catch (error: any) {
            notification.error({
                message: "Lỗi tải hồ sơ",
                description: error?.message || "Đã xảy ra lỗi không mong muốn.",
            });
        } finally {
            setIsLoadingProfile(false);
        }
    }, [notification]);

    const handleUpdateApiKey = async () => {
        setIsUpdatingApiKey(true);
        try {
            const response = await updateApiKeyApi();
            if (!response.status) {
                notification.error({
                    message: "Cập nhật API key thất bại",
                    description: response.message || "Vui lòng thử lại.",
                });
                return;
            }

            setProfile((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    apiKey: response.data.apiKey,
                };
            });

            notification.success({
                message: "Cập nhật API key thành công",
                description: "API key mới đã được tạo.",
            });
        } catch (error: any) {
            notification.error({
                message: "Lỗi cập nhật API key",
                description: error?.message || "Đã xảy ra lỗi không mong muốn.",
            });
        } finally {
            setIsUpdatingApiKey(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const createdAtText = useMemo(() => {
        if (!profile?.createdAt) return "-";
        return formatDateValue(profile.createdAt);
    }, [profile?.createdAt]);

    const updatedAtText = useMemo(() => {
        if (!profile?.updatedAt) return "-";
        return formatDateValue(profile.updatedAt);
    }, [profile?.updatedAt]);

    if (isLoadingProfile) {
        return (
            <div className="p-3 md:p-6 flex justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-3 md:p-6">
                <Card>
                    <Text type="secondary">Không có dữ liệu hồ sơ để hiển thị.</Text>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-3 md:p-6">
            <Space direction="vertical" size={16} className="w-full">
                <Card>
                    <Descriptions column={1} bordered size="middle" styles={{ label: { width: 180 } }}>
                        <Descriptions.Item label="ID người dùng">{profile._id}</Descriptions.Item>
                        <Descriptions.Item label="Họ và tên">{profile.fullName || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Email">{profile.email || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Vai trò">
                            <Tag color="blue">{profile.role || "user"}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{createdAtText}</Descriptions.Item>
                        <Descriptions.Item label="Cập nhật gần nhất">{updatedAtText}</Descriptions.Item>
                        <Descriptions.Item label="API key">
                            <Text code copyable={{ text: profile.apiKey || "" }}>
                                {profile.apiKey || "-"}
                            </Text>
                            <Button
                                type="primary"
                                size="small"
                                icon={<ReloadOutlined />}
                                onClick={handleUpdateApiKey}
                                loading={isUpdatingApiKey} />
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Space>
        </div>
    );
}

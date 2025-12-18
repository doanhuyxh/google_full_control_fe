"use client";

import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { CloudinaryData } from "@/libs/intefaces/cloudinaryData";
import { createCloudinaryAccount, updateCloudinaryAccount } from "@/libs/api-client/cloudinary.api";
import { useAntdApp } from "@/libs/hooks/useAntdApp";

interface CloudinaryFormModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    data: CloudinaryData | null;
    addCloudinaryAccount?: (newAccount: CloudinaryData) => void;
}

export default function CloudinaryFormModal({
    isModalOpen,
    setIsModalOpen,
    data,
    addCloudinaryAccount
}: CloudinaryFormModalProps) {
    const [formData] = Form.useForm();
    const { notification } = useAntdApp();

    const handleOk = async () => {
        try {
            const values = await formData.validateFields();
            let response: any;
            if (data) {
                response = await updateCloudinaryAccount(data._id, values);
            } else {
                response = await createCloudinaryAccount(values);
            }
            if (!response.status) {
                notification.error({
                    message: "Error",
                    description: response.message || "An error occurred while saving the Cloudinary account.",
                });
                return;
            }
            notification.success({
                message: "Success",
                description: `Cloudinary account has been ${data ? "updated" : "created"} successfully.`,
            });
            if (!data && addCloudinaryAccount) {
                addCloudinaryAccount(response.data);
            }
            formData.resetFields();
            setIsModalOpen(false);
        } catch (error:any) {
            if (error.errorFields && error.errorFields.length > 0) {
                return;
            }
            notification.error({
                message: "Error",
                description: error instanceof Error ? error.message : "An error occurred while saving the Cloudinary account.",
            });
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        formData.resetFields();
    };

    useEffect(() => {
        if (isModalOpen && data) {
            formData.setFieldsValue(data);
        }
    }, [isModalOpen, data]);


    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            title={
                <p className="text-center">
                    {data ? "Cập nhật tài khoản Cloudinary" : "Thêm mới tài khoản Cloudinary"}
                </p>
            }
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form
                form={formData}
                style={{ marginTop: 20 }}                
                layout="vertical"
                className="w-full"
            >
                <Form.Item label="Email tài khoản" name="accountMail" rules={[{ required: true, message: "Email tài khoản là bắt buộc" }]}>
                    <Input
                        placeholder="Nhập email tài khoản"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </Form.Item>

                <Form.Item label="Cloud Name" name="cloudName" rules={[{ required: true, message: "Cloud name là bắt buộc" }]}>
                    <Input
                        placeholder="Nhập cloud name"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </Form.Item>

                <Form.Item label="API Key" name="apiKey" rules={[{ required: true, message: "API key là bắt buộc" }]}>
                    <Input
                        placeholder="Nhập API key"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </Form.Item>

                <Form.Item label="API Secret" name="apiSecret" rules={[{ required: true, message: "API secret là bắt buộc" }]}>
                    <Input
                        placeholder="Nhập API secret"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </Form.Item>

                <Form.Item label="Ghi chú" name="note" rules={[]}>
                    <Input.TextArea
                        placeholder="Nhập ghi chú"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        rows={3}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
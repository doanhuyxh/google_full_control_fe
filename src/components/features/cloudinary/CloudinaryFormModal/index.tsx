"use client";

import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { CloudinaryData } from "@/libs/interfaces/cloudinaryData";
import { useCloudinaryAccount } from "@/libs/hooks/users/cloudinaryAccountHook";

interface CloudinaryFormModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    data: CloudinaryData | null;
}

export default function CloudinaryFormModal({
    isModalOpen,
    setIsModalOpen,
    data,
}: CloudinaryFormModalProps) {
    const [formData] = Form.useForm();
    const { createCloudinaryAccount, updateCloudinaryAccount, isCreatingCloudinary, isUpdatingCloudinary } = useCloudinaryAccount();

    const handleOk = async () => {
        try {
            const values = await formData.validateFields();
            if (data) {
                const response = await updateCloudinaryAccount({ id: data._id, payload: values });
                if (!response.status) return;
            } else {
                const response = await createCloudinaryAccount(values);
                if (!response.status) return;
            }
            formData.resetFields();
            setIsModalOpen(false);
        } catch (error: unknown) {
            if (error && typeof error === "object" && "errorFields" in error) return;
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
    }, [isModalOpen, data, formData]);

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            confirmLoading={isCreatingCloudinary || isUpdatingCloudinary}
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
                    <Input placeholder="Nhập email tài khoản" className="w-full border border-gray-300 rounded px-3 py-2" />
                </Form.Item>

                <Form.Item label="Cloud Name" name="cloudName" rules={[{ required: true, message: "Cloud name là bắt buộc" }]}>
                    <Input placeholder="Nhập cloud name" className="w-full border border-gray-300 rounded px-3 py-2" />
                </Form.Item>

                <Form.Item label="API Key" name="apiKey" rules={[{ required: true, message: "API key là bắt buộc" }]}>
                    <Input placeholder="Nhập API key" className="w-full border border-gray-300 rounded px-3 py-2" />
                </Form.Item>

                <Form.Item label="API Secret" name="apiSecret" rules={[{ required: true, message: "API secret là bắt buộc" }]}>
                    <Input placeholder="Nhập API secret" className="w-full border border-gray-300 rounded px-3 py-2" />
                </Form.Item>

                <Form.Item label="Ghi chú" name="note" rules={[]}>
                    <Input.TextArea placeholder="Nhập ghi chú" className="w-full border border-gray-300 rounded px-3 py-2" rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

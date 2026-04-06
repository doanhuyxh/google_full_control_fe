import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

import { useAntdApp } from "@/libs/hooks/useAntdApp";
import RevapiData, { FormRevapiData } from "@/libs/intefaces/revapiData";
import { createRevapiData, updateRevapiData } from "@/libs/network/revapi.api";

interface RevidApiFormModalProps {
    isShowModal: boolean;
    onCloseModal: () => void;
    onSuccess?: () => void;
    editData?: RevapiData | null;
}

export default function RevidApiFormModal({
    isShowModal,
    onCloseModal,
    onSuccess,
    editData,
}: RevidApiFormModalProps) {
    const [formData] = Form.useForm();
    const { notification } = useAntdApp();

    useEffect(() => {
        if (editData) {
            formData.setFieldsValue({
                email: editData.email,
                password: editData.password,
                access_token: editData.access_token,
                api_key: editData.api_key,
            });
        } else {
            formData.resetFields();
        }
    }, [editData, formData]);

    const handleSave = async () => {
        try {
            const values: FormRevapiData = await formData.validateFields();

            const response = editData
                ? await updateRevapiData(editData._id, values)
                : await createRevapiData(values);

            if (response.status) {
                notification.success({
                    message: "Thành công",
                    description: editData
                        ? "Cập nhật tài khoản Revid API thành công."
                        : "Thêm tài khoản Revid API thành công.",
                });
                formData.resetFields();
                onSuccess?.();
                onCloseModal();
            } else {
                notification.error({
                    message: "Lỗi",
                    description: response.message || "Không thể lưu tài khoản Revid API. Vui lòng thử lại sau.",
                });
            }
        } catch {
            notification.error({
                message: "Lỗi",
                description: "Vui lòng kiểm tra lại thông tin đã nhập.",
            });
        }
    };

    return (
        <Form form={formData} layout="vertical" className="w-full">
            <Modal
                title={
                    <p className="text-center">
                        {editData ? "Chỉnh sửa tài khoản Revid API" : "Thêm tài khoản Revid API mới"}
                    </p>
                }
                open={isShowModal}
                onCancel={() => {
                    formData.resetFields();
                    onCloseModal();
                }}
                onOk={handleSave}
                width={700}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item
                    label="Access Token"
                    name="access_token"
                >
                    <Input.TextArea placeholder="Nhập access token" rows={3} />
                </Form.Item>

                <Form.Item
                    label="API Key"
                    name="api_key"
                >
                    <Input placeholder="Nhập API key" />
                </Form.Item>
            </Modal>
        </Form>
    );
}
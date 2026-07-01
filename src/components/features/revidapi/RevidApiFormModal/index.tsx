import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

import RevapiData, { FormRevapiData } from "@/libs/interfaces/revapiData";
import { useRevidApiAccount } from "@/libs/hooks/users/revidapiAccountHook";

interface RevidApiFormModalProps {
    isShowModal: boolean;
    onCloseModal: () => void;
    editData?: RevapiData | null;
}

export default function RevidApiFormModal({
    isShowModal,
    onCloseModal,
    editData,
}: RevidApiFormModalProps) {
    const [formData] = Form.useForm();
    const { createRevidApiAccount, updateRevidApiAccount, isCreatingRevidApi, isUpdatingRevidApi } = useRevidApiAccount();

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

            if (editData) {
                const response = await updateRevidApiAccount({ id: editData._id, payload: values });
                if (!response.status) return;
            } else {
                const response = await createRevidApiAccount(values);
                if (!response.status) return;
            }

            formData.resetFields();
            onCloseModal();
        } catch {
            // validation error
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
                confirmLoading={isCreatingRevidApi || isUpdatingRevidApi}
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

                <Form.Item label="Access Token" name="access_token">
                    <Input.TextArea placeholder="Nhập access token" rows={3} />
                </Form.Item>

                <Form.Item label="API Key" name="api_key">
                    <Input placeholder="Nhập API key" />
                </Form.Item>
            </Modal>
        </Form>
    );
}

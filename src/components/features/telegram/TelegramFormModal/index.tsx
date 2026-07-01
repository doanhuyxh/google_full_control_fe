import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { useTelegramAccount, useTelegramAccountDetail } from "@/libs/hooks/users/telegramAccountHook";
import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";

interface TelegramFormModalProps {
    isVisible: boolean;
    teleId: string;
    onClose: () => void;
}

export default function TelegramFormModal({ isVisible, teleId, onClose }: TelegramFormModalProps) {
    const [form] = Form.useForm();
    const { notification } = useAntdApp();
    const { createTelegramAccount, updateTelegramAccount, isCreatingTelegram, isUpdatingTelegram } = useTelegramAccount();
    const { data: detailData } = useTelegramAccountDetail(teleId, isVisible && !!teleId);

    useEffect(() => {
        if (isVisible && form) {
            form.resetFields();
            if (teleId && detailData) {
                form.setFieldsValue(detailData);
            }
        }
    }, [isVisible, teleId, detailData, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (teleId) {
                const response = await updateTelegramAccount({ teleId, formData: values });
                if (!response.status) return;
            } else {
                const response = await createTelegramAccount(values);
                if (!response.status) return;
            }
            onClose();
        } catch (error: unknown) {
            if (error && typeof error === "object" && "errorFields" in error) {
                notification.error({
                    message: 'Lỗi xác thực',
                    description: 'Vui lòng kiểm tra lại các trường thông tin.',
                });
            } else {
                notification.error({
                    message: 'Lỗi không xác định',
                    description: 'Đã xảy ra lỗi khi lưu dữ liệu.',
                });
            }
        }
    };

    return (
        <Modal
            width={800}
            title={<p className="text-center">
                {teleId ? 'Cập nhật tài khoản Telegram' : 'Thêm mới tài khoản Telegram'}
            </p>}
            open={isVisible}
            onCancel={onClose}
            onOk={handleSave}
            confirmLoading={isCreatingTelegram || isUpdatingTelegram}
        >
            <Form
                form={form}
                layout="vertical"
                name="telegram_form"
            >
                <Form.Item
                    name="name"
                    label="Tên gợi nhớ"
                    rules={[{ required: true, message: 'Vui lòng nhập tên gợi nhớ!' }]}
                >
                    <Input placeholder="Nhập tên gợi nhớ" />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    name="username"
                    label="Username"
                >
                    <Input placeholder="Nhập username" />
                </Form.Item>

                <Form.Item
                    name="apiId"
                    label="API ID"
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Nhập API ID" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    name="f2a"
                    label="Mã 2FA"
                >
                    <Input placeholder="Nhập mã 2FA" />
                </Form.Item>
            </Form>
        </Modal>
    );
}

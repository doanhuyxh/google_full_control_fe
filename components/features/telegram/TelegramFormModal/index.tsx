import { createTelegramAccount, getTelegramAccountDetail, updateTelegramAccount } from "@/libs/api-client/telegram.api";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";

interface TelegramFormModalProps {
    isVisible: boolean;
    teleId: string;
    onClose: () => void;
    onAddData: (data: any) => void;
    onUpdateData: (data: any) => void;
}

export default function TelegramFormModal({ isVisible, teleId, onClose, onAddData, onUpdateData }: TelegramFormModalProps) {
    const [form] = Form.useForm();
    const { notification } = useAntdApp();

    const initData = async () => {
        const response = await getTelegramAccountDetail(teleId);
        if (response.status) {
            form.setFieldsValue(response.data);
        } else {
            notification.error({
                message: 'Lấy chi tiết tài khoản Telegram thất bại',
                description: response.message || 'Không thể kết nối đến máy chủ',
            });
        }
    }

    useEffect(() => {
        if (isVisible && form) {
            form.resetFields();
            if (teleId) {
                initData();
            }
        }
    }, [isVisible, teleId, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            let dataSave: any = null;
            if (teleId) {
                const response = await updateTelegramAccount(teleId, values);
                if (!response.status) {
                    notification.error({
                        message: 'Cập nhật tài khoản Telegram thất bại',
                        description: response.message || 'Không thể kết nối đến máy chủ',
                    });
                    return;
                }
                dataSave = response.data;
            } else {
                const response = await createTelegramAccount(values);
                if (!response.status) {
                    notification.error({
                        message: 'Tạo tài khoản Telegram thất bại',
                        description: response.message || 'Không thể kết nối đến máy chủ',
                    });
                    return;
                }
                dataSave = response.data;
            }
            if (teleId) {
                onUpdateData(dataSave);
            } else {
                onAddData(dataSave);
            }
            onClose();
        } catch (error: any) {
            if (error.errorFields) {
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
    }

    return (
        <Modal
            width={800}
            title={<p className="text-center">
                {teleId ? 'Cập nhật tài khoản Telegram' : 'Thêm mới tài khoản Telegram'}
            </p>}
            open={isVisible}
            onCancel={onClose}
            onOk={handleSave}
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
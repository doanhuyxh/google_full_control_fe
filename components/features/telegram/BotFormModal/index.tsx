import { createBot } from "@/libs/api-client/telegram.api";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { Form, Input, Modal } from "antd";
import { useState } from "react";


interface BotFormModalProp {
    telegramId: string;
    isShowModal: boolean;
    onClose: () => void;
}

export default function BotFormModal({ isShowModal, onClose, telegramId }: BotFormModalProp) {
    const [form] = Form.useForm();
    const { notification } = useAntdApp();
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const response = await createBot(
                telegramId,
                values.botToken,
                values.botUsername,
                values.note || ""
            );
            setLoading(false);
            if (!response.status) {
                notification.error({
                    message: "Lỗi khi tạo bot",
                    description: response.message || "Đã xảy ra lỗi không xác định.",
                });
                return;
            }
            notification.success({
                message: "Tạo bot thành công",
            });
            onClose();
            form.resetFields();
        } catch (error: any) {
            if (error.errorFields) {
                notification.error({
                    message: "Vui lòng điền đủ các trường thông tin",
                })
                return;
            } else {
                notification.error({
                    message: 'Lỗi không xác định',
                    description: 'Đã xảy ra lỗi khi lưu dữ liệu.',
                });
            }

        };
    }

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Tạo bot mới"
            className="text-center"
            open={isShowModal}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Tạo mới"
            cancelText="Hủy"
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_bot_telegram"
                initialValues={{ note: "" }}
            >
                <Form.Item
                    name="botUsername"
                    label="Bot Username"
                    rules={[{ required: true, message: "Vui lòng nhập Bot Username!" }]}
                >
                    <Input placeholder="@my_bot" />
                </Form.Item>

                <Form.Item
                    name="botToken"
                    label="Bot Token"
                    rules={[{ required: true, message: "Vui lòng nhập Bot Token!" }]}
                >
                    <Input placeholder="123456789:ABCDEF..." />
                </Form.Item>

                <Form.Item
                    name="note"
                    label="Ghi chú"
                >
                    <Input.TextArea rows={3} placeholder="Nhập ghi chú cho bot này..." />
                </Form.Item>
            </Form>
        </Modal>
    );
}
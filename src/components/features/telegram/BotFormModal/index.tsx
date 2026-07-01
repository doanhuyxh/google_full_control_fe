import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { useTelegramBot } from "@/libs/hooks/users/telegramBotHook";
import { Form, Input, Modal } from "antd";

interface BotFormModalProp {
    telegramId: string;
    isShowModal: boolean;
    onClose: () => void;
}

export default function BotFormModal({ isShowModal, onClose, telegramId }: BotFormModalProp) {
    const [form] = Form.useForm();
    const { notification } = useAntdApp();
    const { createBot, isCreatingBot } = useTelegramBot(telegramId, isShowModal);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await createBot({
                botToken: values.botToken,
                botUsername: values.botUsername,
                note: values.note || "",
            });
            if (!response.status) return;
            onClose();
            form.resetFields();
        } catch (error: unknown) {
            if (error && typeof error === "object" && "errorFields" in error) {
                notification.error({
                    message: "Vui lòng điền đủ các trường thông tin",
                });
            } else {
                notification.error({
                    message: 'Lỗi không xác định',
                    description: 'Đã xảy ra lỗi khi lưu dữ liệu.',
                });
            }
        }
    };

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
            confirmLoading={isCreatingBot}
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

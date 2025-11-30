import { Form, Modal, Input } from "antd";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { createGoogleAccount } from "@/libs/api-client/google.api";

interface GoogleFormProps {
    isShowModal?: boolean;
    onCloseModal?: () => void;
    onSuccess?: () => void;
    accountId?: string;
}

export default function GoogleFormModal({ isShowModal, onCloseModal, onSuccess, accountId }: GoogleFormProps) {
    const [formData] = Form.useForm();
    const {notification} = useAntdApp();
    const handleSave = async () => {
        try {
            const values = await formData.validateFields();
            const response = await createGoogleAccount(values);
            if (response.status) {
                notification.success({
                    message: "Thành công",
                    description: "Lưu tài khoản Google thành công.",
                });
                onSuccess?.();
                onCloseModal?.();
            } else {
                notification.error({
                    message: "Lỗi",
                    description: response.message || "Không thể lưu tài khoản Google. Vui lòng thử lại sau.",
                });
            }
        }
        catch (error) {
            console.error("Failed to save Google account:", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể lưu tài khoản Google. Vui lòng thử lại sau.",

            });
        }
    }

    return <Modal
        title={<p className="text-center">{accountId ? "Edit Google Account" : "Add New Google Account"}</p>}
        open={isShowModal}
        onCancel={onCloseModal}
        onOk={handleSave}
        width={1200}
        destroyOnHidden
    >
        <div className="w-full min-h-[40vh]">
            <Form
                form={formData}
                layout="vertical"
                className="w-full"
            >
                <Form.Item
                    label="Họ tên"
                    name="fullName"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                >
                    <Input placeholder="Nhập họ tên" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" }
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="currentPassword"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item
                    label="App Password"
                    name="appPassword"
                >
                    <Input placeholder="Nhập app password" />
                </Form.Item>

                <Form.Item
                    label="2FA/Google Authenticator"
                    name="f2a"
                >
                    <Input placeholder="Nhập 2FA/Google Authenticator" />
                </Form.Item>

                <Form.Item
                    label="Recovery Email"
                    name="recoveryEmail"
                >
                    <Input placeholder="Nhập recovery email" />
                </Form.Item>

                <Form.Item
                    label="Recovery Phone"
                    name="recoveryPhoneNumber"
                >
                    <Input placeholder="Nhập recovery phone" />
                </Form.Item>

                <Form.Item
                    label="Private Code"
                    name="privateCode"
                >
                    <Input.TextArea placeholder="Nhập private code" rows={4} />
                </Form.Item>
            </Form>

        </div>
    </Modal>;
}
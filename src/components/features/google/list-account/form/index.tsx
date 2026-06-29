import { Form, Modal, Input } from "antd";
import { useGoogleAccount } from "@/libs/hooks/users/googleAccoutHook";

interface GoogleFormProps {
    isShowModal?: boolean;
    onCloseModal?: () => void;
    accountId?: string;
}

export default function GoogleFormModal({ isShowModal, onCloseModal, accountId }: GoogleFormProps) {
    const [formData] = Form.useForm();
    const { createGoogleAccount, isCreatingGoogle } = useGoogleAccount();

    const handleSave = async () => {
        try {
            const values = await formData.validateFields();
            const response = await createGoogleAccount(values);
            if (!response.status) return;
            onCloseModal?.();
            formData.resetFields();
        } catch (error) {
            console.error("Failed to save Google account:", error);
        }
    };

    return <Modal
        title={<p className="text-center">{accountId ? "Edit Google Account" : "Add New Google Account"}</p>}
        open={isShowModal}
        onCancel={onCloseModal}
        onOk={handleSave}
        confirmLoading={isCreatingGoogle}
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

                <Form.Item label="Số điện thoại" name="phoneNumber">
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="currentPassword"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item label="App Password" name="appPassword">
                    <Input placeholder="Nhập app password" />
                </Form.Item>

                <Form.Item label="2FA/Google Authenticator" name="f2a">
                    <Input placeholder="Nhập 2FA/Google Authenticator" />
                </Form.Item>

                <Form.Item label="Recovery Email" name="recoveryEmail">
                    <Input placeholder="Nhập recovery email" />
                </Form.Item>

                <Form.Item label="Recovery Phone" name="recoveryPhoneNumber">
                    <Input placeholder="Nhập recovery phone" />
                </Form.Item>

                <Form.Item label="Private Code" name="privateCode">
                    <Input.TextArea placeholder="Nhập private code" rows={4} />
                </Form.Item>

                <Form.Item label="Cookies" name="cookies">
                    <Input.TextArea placeholder="Nhập cookies" rows={4} />
                </Form.Item>
            </Form>

        </div>
    </Modal>;
}

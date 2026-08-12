import { Form, Modal, Input, Row, Col } from "antd";
import { useGoogleAccount } from "@/libs/hooks/users/googleAccountHook";

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

    return (
        <Modal
            title={
                <p className="text-center">
                    {accountId ? "Cập nhật tài khoản Google" : "Tạo tài khoản Google mới"}
                </p>
            }
            open={isShowModal}
            onCancel={onCloseModal}
            onOk={handleSave}
            confirmLoading={isCreatingGoogle}
            width={900}
            destroyOnHidden
            style={{ top: 10 }}
        >
            <Form form={formData} layout="vertical" className="w-full">
                <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Họ tên"
                            name="fullName"
                            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                        >
                            <Input placeholder="Nhập họ tên" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
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
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Số điện thoại" name="phoneNumber">
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Mật khẩu"
                            name="currentPassword"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="App Password" name="appPassword">
                            <Input.Password placeholder="Nhập app password" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="2FA/Google Authenticator" name="f2a">
                            <Input.Password placeholder="Nhập 2FA/Google Authenticator" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Recovery Email" name="recoveryEmail">
                            <Input placeholder="Nhập recovery email" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Recovery Phone" name="recoveryPhoneNumber">
                            <Input placeholder="Nhập recovery phone" />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item label="Private Code" name="privateCode">
                            <Input.TextArea placeholder="Nhập private code" rows={4} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item label="Cookies" name="cookies">
                            <Input.TextArea placeholder="Nhập cookies" rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

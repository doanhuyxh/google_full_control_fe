"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Space, Tag, Modal, Divider } from "antd";
import { PlusOutlined, ClearOutlined, SaveOutlined, SendOutlined } from "@ant-design/icons";
import TiptapComponent from "@/components/common/TextEditer/TiptapEditor";
import { useAntdApp } from "@/libs/hooks/useAntdApp";

const VARIABLE_PLACEHOLDERS = [
    { label: "Tên", value: "{{name}}" },
    { label: "Email", value: "{{email}}" },
    { label: "Công ty", value: "{{company}}" },
    { label: "Ngày", value: "{{date}}" },
    { label: "Số điện thoại", value: "{{phone}}" },
];

export default function GoogleTemplateMail() {
    const [form] = Form.useForm();
    const { notification } = useAntdApp();
    const [bodyContent, setBodyContent] = useState("");
    const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);
    const [testEmailData, setTestEmailData] = useState({
        recipientEmail: "",
        name: "Nguyễn Văn A",
        email: "example@gmail.com",
        company: "ABC Company",
        date: new Date().toLocaleDateString("vi-VN"),
        phone: "0123456789",
    });
    const [sendingTest, setSendingTest] = useState(false);

    const handleSaveTemplate = async () => {
        try {
            const values = await form.validateFields();
            // Here you can add API call to save the template
            console.log("Template data:", values);
            notification.success({
                message: "Thành công",
                description: "Đã lưu template thành công!",
            });
            form.resetFields();
            setBodyContent("");
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const handleClearForm = () => {
        form.resetFields();
        setBodyContent("");
    };

    const handleBodyChange = (value: string) => {
        setBodyContent(value);
        form.setFieldValue("body", value);
    };

    const insertPlaceholder = (placeholder: string) => {
        const newBody = bodyContent + " " + placeholder;
        setBodyContent(newBody);
        form.setFieldValue("body", newBody);
    };

    const handleSendTestEmail = async () => {
        try {
            // Validate form first
            const values = await form.validateFields();

            if (!testEmailData.recipientEmail) {
                notification.warning({
                    message: "Thiếu thông tin",
                    description: "Vui lòng nhập email người nhận!",
                });
                return;
            }

            setSendingTest(true);

            // Replace placeholders with sample data
            let processedSubject = values.subject;
            let processedBody = values.body;

            const replacements: Record<string, string> = {
                "{{name}}": testEmailData.name,
                "{{email}}": testEmailData.email,
                "{{company}}": testEmailData.company,
                "{{date}}": testEmailData.date,
                "{{phone}}": testEmailData.phone,
            };

            Object.entries(replacements).forEach(([placeholder, value]) => {
                processedSubject = processedSubject.replace(new RegExp(placeholder, "g"), value);
                processedBody = processedBody.replace(new RegExp(placeholder, "g"), value);
            });

            // Here you would call your API to send the email
            console.log("Sending test email:", {
                to: testEmailData.recipientEmail,
                subject: processedSubject,
                body: processedBody,
            });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            notification.success({
                message: "Thành công",
                description: `Email test đã được gửi đến ${testEmailData.recipientEmail}!`,
            });

            setTestEmailModalOpen(false);
            setSendingTest(false);
        } catch (error) {
            console.error("Failed to send test email:", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể gửi email test. Vui lòng thử lại!",
            });
            setSendingTest(false);
        }
    };

    return (
        <div className="w-full p-6 max-w-7xl mx-auto">
            <Card
                title={
                    <span className="text-xl font-semibold">
                        Tạo Template Email
                    </span>
                }
                className="shadow-md"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên Template"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên template!" }]}
                    >
                        <Input placeholder="Ví dụ: Email chào mừng khách hàng mới" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Tiêu đề Email"
                        name="subject"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề email!" }]}
                    >
                        <Input placeholder="Ví dụ: Chào mừng {{name}} đến với {{company}}" size="large" />
                    </Form.Item>

                    {/* Variable Placeholders */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Biến động (nhấn để chèn):</label>
                        <Space wrap>
                            {VARIABLE_PLACEHOLDERS.map(placeholder => (
                                <Tag
                                    key={placeholder.value}
                                    color="blue"
                                    className="cursor-pointer hover:opacity-80"
                                    onClick={() => insertPlaceholder(placeholder.value)}
                                >
                                    <PlusOutlined className="mr-1" />
                                    {placeholder.label} ({placeholder.value})
                                </Tag>
                            ))}
                        </Space>
                    </div>

                    <Form.Item
                        label="Nội dung Email"
                        name="body"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung email!" }]}
                    >
                        <TiptapComponent
                            value={bodyContent}
                            onChange={handleBodyChange}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSaveTemplate}
                                size="large"
                            >
                                Lưu Template
                            </Button>
                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleClearForm}
                                size="large"
                            >
                                Xóa Form
                            </Button>
                        </Space>
                    </Form.Item>

                    <Divider />

                    {/* Test Email Section */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-3">Gửi Email Test</h3>
                        <p className="text-gray-600 mb-4">
                            Gửi email test để xem trước template với dữ liệu mẫu
                        </p>
                        <Button
                            type="default"
                            icon={<SendOutlined />}
                            onClick={() => setTestEmailModalOpen(true)}
                            size="large"
                        >
                            Gửi Email Test
                        </Button>
                    </div>
                </Form>
            </Card>

            {/* Test Email Modal */}
            <Modal
                title="Gửi Email Test"
                open={testEmailModalOpen}
                onOk={handleSendTestEmail}
                onCancel={() => setTestEmailModalOpen(false)}
                okText="Gửi Email"
                cancelText="Hủy"
                confirmLoading={sendingTest}
                width={700}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium text-red-600">Email người nhận *</label>
                        <Input
                            placeholder="example@gmail.com"
                            value={testEmailData.recipientEmail}
                            onChange={(e) => setTestEmailData({ ...testEmailData, recipientEmail: e.target.value })}
                            size="large"
                        />
                    </div>

                    <Divider>Dữ liệu mẫu cho biến động</Divider>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium">Tên ({"{{name}}"})</label>
                            <Input
                                value={testEmailData.name}
                                onChange={(e) => setTestEmailData({ ...testEmailData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Email ({"{{email}}"})</label>
                            <Input
                                value={testEmailData.email}
                                onChange={(e) => setTestEmailData({ ...testEmailData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Công ty ({"{{company}}"})</label>
                            <Input
                                value={testEmailData.company}
                                onChange={(e) => setTestEmailData({ ...testEmailData, company: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Ngày ({"{{date}}"})</label>
                            <Input
                                value={testEmailData.date}
                                onChange={(e) => setTestEmailData({ ...testEmailData, date: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block mb-2 font-medium">Số điện thoại ({"{{phone}}"})</label>
                            <Input
                                value={testEmailData.phone}
                                onChange={(e) => setTestEmailData({ ...testEmailData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>Lưu ý:</strong> Email test sẽ thay thế tất cả các biến động bằng dữ liệu mẫu bên trên.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
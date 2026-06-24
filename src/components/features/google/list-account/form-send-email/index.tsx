"use client"
import { useCallback, useEffect, useState } from "react";
import { Form, Input, Modal, Select, Spin } from "antd";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { useGoogleAccount } from "@/libs/hooks/users/googleAccoutHook";
import { sendMailToOtherEmail } from "@/libs/network/google.api";
import TiptapComponent from "@/components/common/TextEditer/TiptapEditor"

interface GoogleFormSendEmailProps {
    isShowModal?: boolean;
    onCloseModal?: () => void;
}

export default function GoogleFormSendEmail({ isShowModal, onCloseModal }: GoogleFormSendEmailProps) {

    const [formData] = Form.useForm();
    const { notification } = useAntdApp();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { accountData, setSearchGoogle, loadingGoogle, searchGoogle, fetchGoogleAccounts, setLimitGoogle } = useGoogleAccount();

    const handleSendEmail = async () => {
        try {
            const values = await formData.validateFields();
            const emailIdSent = values.SenderEmails as string;
            const listEmailRecipient: string[] = (values.recipientEmails || "").split("\n").map((email: string) => email.trim()).filter((email: string) => email);
            if (listEmailRecipient.length === 0) {
                notification.warning({
                    message: "No recipient emails",
                    description: "Please enter at least one email address.",
                });
                return;
            }
            setIsLoading(true);
            const results = await Promise.all(
                listEmailRecipient.map(recipientEmail =>
                    sendMailToOtherEmail(
                        emailIdSent,
                        recipientEmail,
                        values.subject,
                        values.message
                    )
                )
            );
            setIsLoading(false);
            const failedResults = results.filter(result => !result.status);
            if (failedResults.length === 0) {
                notification.success({
                    message: "Success",
                    description: "All emails have been sent successfully.",
                });
            } else {
                const listError = failedResults.map((res) => res.message).join("; ");
                notification.error({
                    message: "Some emails failed to send",
                    description: `Failed to send ${failedResults.length} out of ${listEmailRecipient.length} emails. Errors: ${listError}`,
                });

            }

        } catch (error) {
            console.error("Failed to send emails:", error);
            notification.error({
                message: "Error",
                description: "Failed to send emails. Please try again later.",
            });
        }
    }

    const handleMessageChange = useCallback((val: string) => {
        formData?.setFieldValue("message", val);
    }, [formData]);

    useEffect(() => {
        if (!isShowModal) {
            return;
        }
        setLimitGoogle(100);
        fetchGoogleAccounts();
    }, [isShowModal, searchGoogle]);

    if (!isShowModal) {
        return null
    }


    return <Modal
        title={<p className="text-center">Send Email</p>}
        open={isShowModal}
        onCancel={onCloseModal}
        confirmLoading={isLoading}
        onOk={handleSendEmail}
        okText="Send Email"
        destroyOnHidden
    >
        <div className="w-full min-h-[20vh]">
            <Form
                form={formData}
                layout="vertical"
                className="w-full"
            >
                <Form.Item
                    label="Tiêu đề"
                    name="subject"
                >
                    <Input placeholder="Nhập tiêu đề email" className="w-full border border-gray-300 rounded px-3 py-2" />
                </Form.Item>

                <Form.Item
                    label="Nội dung email"
                    name="message"
                >
                    <TiptapComponent
                        value={formData.getFieldValue('message') || ""}
                        onChange={handleMessageChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ email người nhận (phân tách bằng dòng mới)"
                    name="recipientEmails"
                >
                    <Input.TextArea placeholder="Nhập địa chỉ email người nhận, phân tách bằng dòng mới" className="w-full border border-gray-300 rounded px-3 py-2" rows={3} />
                </Form.Item>

                <Form.Item
                    label="Tài khoản email người gửi"
                    name="SenderEmails"
                >
                    <Select
                        placeholder="Chọn tài khoản email người gửi"
                        filterOption={false}
                        showSearch
                        notFoundContent={loadingGoogle ? <Spin size="small" /> : "Không có dữ liệu"}
                        onSearch={(value) => {
                            setSearchGoogle(value);
                        }}
                    >
                        {accountData
                            .map(account => (
                                <Select.Option key={account._id} value={account._id}>
                                    <span className={account.appPassword ? "text-green-500" : "text-red-500"}>
                                        {account.fullName} ({account.email}) ({account.appPassword ? "Có" : "Không"})
                                    </span>
                                </Select.Option>
                            ))}
                    </Select>
                </Form.Item>


            </Form>
        </div>
    </Modal>
}
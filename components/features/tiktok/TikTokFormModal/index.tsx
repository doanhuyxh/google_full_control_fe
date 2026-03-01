import { Form, Modal, Input, Select } from "antd";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { addTikTokAccount, updateTikTokAccount } from "@/libs/network/tiktok.api";
import { FormTikTokAccountData } from "@/libs/intefaces/tiktokData";
import useCountries from "@/libs/hooks/useCountries";
import { useEffect } from "react";
import TikTokAccountData from "@/libs/intefaces/tiktokData";

interface TikTokFormModalProps {
    isShowModal: boolean;
    onCloseModal: () => void;
    onSuccess?: () => void;
    editData?: TikTokAccountData | null;
}

export default function TikTokFormModal({ isShowModal, onCloseModal, onSuccess, editData }: TikTokFormModalProps) {
    const [formData] = Form.useForm();
    const { notification } = useAntdApp();
    const { countries } = useCountries();

    useEffect(() => {
        if (editData) {
            formData.setFieldsValue({
                username: editData.username,
                password: editData.password,
                email: editData.email,
                phoneNumber: editData.phoneNumber,
                f2a: editData.f2a,
                countryCode: editData.countryCode,
            });
        } else {
            formData.resetFields();
        }
    }, [editData, formData]);

    const handleSave = async () => {
        try {
            const values: FormTikTokAccountData = await formData.validateFields();

            let response;
            if (editData) {
                response = await updateTikTokAccount(editData._id, values);
            } else {
                response = await addTikTokAccount(values);
            }

            if (response.status) {
                notification.success({
                    message: "Thành công",
                    description: editData
                        ? "Cập nhật tài khoản TikTok thành công."
                        : "Thêm tài khoản TikTok thành công.",
                });
                formData.resetFields();
                onSuccess?.();
                onCloseModal();
            } else {
                notification.error({
                    message: "Lỗi",
                    description: response.message || "Không thể lưu tài khoản TikTok. Vui lòng thử lại sau.",
                });
            }
        } catch (error) {
            console.error("Failed to save TikTok account:", error);
            notification.error({
                message: "Lỗi",
                description: "Vui lòng kiểm tra lại thông tin đã nhập.",
            });
        }
    };

    return (
        <Form form={formData} layout="vertical" className="w-full">

            <Modal
                title={
                    <p className="text-center">
                        {editData ? "Chỉnh sửa tài khoản TikTok" : "Thêm tài khoản TikTok mới"}
                    </p>
                }
                open={isShowModal}
                onCancel={() => {
                    formData.resetFields();
                    onCloseModal();
                }}
                onOk={handleSave}
                width={800}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Vui lòng nhập username" }]}
                >
                    <Input placeholder="Nhập username TikTok" />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { type: "email", message: "Email không hợp lệ" },
                    ]}
                >
                    <Input placeholder="Nhập email liên kết" />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                    label="2FA (Two-Factor Authentication)"
                    name="f2a"
                >
                    <Input placeholder="Nhập mã 2FA" />
                </Form.Item>
                <Form.Item
                    label="Quốc gia"
                    name="countryCode"
                >
                    <Select
                        showSearch
                        placeholder="Chọn quốc gia"
                        optionFilterProp="label"
                        allowClear
                        options={countries.map((country) => ({
                            value: country.cca2,
                            label: `${country.name.common} (${country.cca2})`,
                        }))}
                    />
                </Form.Item>
            </Modal>
        </Form>
    );
}

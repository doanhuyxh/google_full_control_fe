import { Form, Modal, Input, Select, Row, Col, Divider } from "antd";
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
                uid: editData.uid,
                secUid: editData.secUid,
                uniqueId: editData.uniqueId,
                nickName: editData.nickName,
                signature: editData.signature,
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
            console.log("Failed to save TikTok account:", error);
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
                width={1200}
            >
                <Row gutter={24}>
                    {/* CỘT 1: THÔNG TIN ĐỊNH DANH (Dữ liệu hệ thống) */}
                    <Col span={12} className="border-r border-gray-100">
                        <Divider orientation="left" plain>Thông tin hệ thống</Divider>
                        <Form.Item
                            label="ID tài khoản (UID)"
                            name="uid"
                        >
                            <Input placeholder="Ví dụ: 706..." />
                        </Form.Item>
                        <Form.Item
                            label="SecUid"
                            name="secUid"
                        >
                            <Input placeholder="Mã bảo mật định danh" />
                        </Form.Item>
                        <Form.Item
                            label="Username (UniqueId)"
                            name="uniqueId"
                            rules={[{ required: true, message: "Vui lòng nhập username" }]}
                        >
                            <Input placeholder="@username" />
                        </Form.Item>
                        <Form.Item
                            label="Signature (Chữ ký)"
                            name="signature"
                        >
                            <Input.TextArea placeholder="Nội dung bio/signature" rows={2} />
                        </Form.Item>
                    </Col>
                    {/* CỘT 2: THÔNG TIN CÁ NHÂN & BẢO MẬT */}
                    <Col span={12}>
                        <Divider orientation="left" plain>Thông tin đăng nhập</Divider>
                        <Form.Item
                            label="Nickname"
                            name="nickName"
                        >
                            <Input placeholder="Tên hiển thị" />
                        </Form.Item>
                        <Form.Item label="Mật khẩu" name="password">
                            <Input.Password placeholder="Nhập mật khẩu (nếu có)" />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ type: "email", message: "Email không hợp lệ" }]}
                        >
                            <Input placeholder="example@mail.com" />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phoneNumber">
                            <Input placeholder="090..." />
                        </Form.Item>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item label="Mã 2FA" name="f2a">
                                    <Input placeholder="2FA Key" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Quốc gia" name="countryCode">
                                    <Select
                                        showSearch
                                        placeholder="Chọn"
                                        optionFilterProp="label"
                                        options={countries.map((c) => ({
                                            value: c.cca2,
                                            label: `${c.cca2}`,
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    {/* DÀNH RIÊNG CHO COOKIES */}
                    <Col span={24}>
                        <Divider />
                        <Form.Item
                            label="Dữ liệu Cookies"
                            name="cookies"
                            extra="Dán toàn bộ chuỗi cookie vào đây để hệ thống tự động xử lý."
                        >
                            <Input.TextArea
                                placeholder="sessionid=xxx; store-idc=xxx; ..."
                                rows={4}
                                className="font-mono text-xs"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Modal>
        </Form>
    );
}

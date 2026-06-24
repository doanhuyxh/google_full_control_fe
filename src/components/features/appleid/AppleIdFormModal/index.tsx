"use client";

import { Modal, Form, Input, DatePicker, Button, Space, Card, Row, Col, Select } from "antd";
import { useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import AppleIdData, { FormAppleIdData } from "@/libs/intefaces/appleIdData";
import { createAppleIDAccount, updateAppleIDAccount } from "@/libs/network/appleId.api";
import useCountries from "@/libs/hooks/useCountries";

interface AppleIdFormModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    data: AppleIdData | null;
    addAppleIdAccount?: (newAccount: AppleIdData) => void;
    refreshData?: () => void; // Thêm tùy chọn refresh nếu cần
}

export default function AppleIdFormModal({
    isModalOpen,
    setIsModalOpen,
    data,
    addAppleIdAccount
}: AppleIdFormModalProps) {
    const [formData] = Form.useForm();
    const { notification } = useAntdApp();
    const { countries } = useCountries();

    const handleOk = async () => {
        try {
            const values = await formData.validateFields();

            // Chuẩn bị dữ liệu để gửi đi (Convert dayjs object thành string cho birthday)
            const payload: FormAppleIdData = {
                ...values,
                birthday: values.birthday ? dayjs(values.birthday).format("YYYY-MM-DD") : "",
            };

            let response: any;
            if (data) {
                response = await updateAppleIDAccount(data._id, payload);
            } else {
                response = await createAppleIDAccount(payload);
            }

            if (!response.status) {
                notification.error({
                    message: "Lỗi",
                    description: response.message || "Đã xảy ra lỗi khi lưu tài khoản Apple ID.",
                });
                return;
            }

            notification.success({
                message: "Thành công",
                description: `Tài khoản Apple ID đã được ${data ? "cập nhật" : "tạo mới"} thành công.`,
            });

            if (!data && addAppleIdAccount) {
                addAppleIdAccount(response.data);
            }

            formData.resetFields();
            setIsModalOpen(false);
        } catch (error: any) {
            if (error.errorFields && error.errorFields.length > 0) {
                return;
            }
            notification.error({
                message: "Lỗi",
                description: error instanceof Error ? error.message : "Đã xảy ra lỗi hệ thống.",
            });
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        formData.resetFields();
    };

    useEffect(() => {
        if (isModalOpen) {
            if (data) {
                // Khi edit, cần convert string date sang dayjs object cho DatePicker
                formData.setFieldsValue({
                    ...data,
                    birthday: data.birthday ? dayjs(data.birthday) : null,
                });
            } else {
                formData.resetFields();
            }
        }
    }, [isModalOpen, data, formData]);

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            title={
                <p className="text-center text-lg font-semibold">
                    {data ? "Cập nhật tài khoản Apple ID" : "Thêm mới tài khoản Apple ID"}
                </p>
            }
            okText="Lưu"
            cancelText="Hủy"
            width={800} // Tăng độ rộng modal vì form dài
        >
            <Form
                form={formData}
                style={{ marginTop: 20 }}
                layout="vertical"
                className="w-full"
                autoComplete="off"
            >
                {/* --- Thông tin đăng nhập --- */}
                <h3 className="mb-3 font-semibold text-gray-700 border-b pb-1">Thông tin đăng nhập</h3>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Apple ID"
                            name="appleId"
                            rules={[{ required: true, message: "Vui lòng nhập Apple ID" }]}
                        >
                            <Input placeholder="Nhập Apple ID" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* --- Thông tin cá nhân --- */}
                <h3 className="mb-3 mt-2 font-semibold text-gray-700 border-b pb-1">Thông tin cá nhân</h3>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="fullName"
                            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                        >
                            <Input placeholder="Nhập họ và tên" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày sinh"
                            name="birthday"
                            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
                        >
                            <DatePicker
                                className="w-full"
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày sinh"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Email liên hệ"
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email" },
                                { type: 'email', message: "Email không hợp lệ" }
                            ]}
                        >
                            <Input placeholder="example@mail.com" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                            rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Mã quốc gia"
                            name="countryCode"
                            rules={[{ required: true, message: "Nhập mã QG" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn mã quốc gia"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={countries.map(country => ({
                                    label: country.name.common,
                                    value: country.cca2,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Địa chỉ" name="address">
                    <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
                </Form.Item>
                {/* --- Câu hỏi bảo mật --- */}
                <h3 className="mb-3 mt-2 font-semibold text-gray-700 border-b pb-1">Câu hỏi bảo mật</h3>
                <Form.List name="questionSecurity">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Card
                                    key={key}
                                    size="small"
                                    className="mb-3 bg-gray-50 border-gray-200"
                                >
                                    <Space className="w-full justify-between mb-2">
                                        <span className="font-medium">Câu hỏi {name + 1}</span>
                                        <MinusCircleOutlined
                                            className="text-red-500 cursor-pointer hover:text-red-700"
                                            onClick={() => remove(name)}
                                        />
                                    </Space>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'question']}
                                        label="Câu hỏi"
                                        rules={[{ required: true, message: 'Thiếu câu hỏi' }]}
                                        className="mb-2"
                                    >
                                        <Input placeholder="Nội dung câu hỏi" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'answer']}
                                        label="Câu trả lời"
                                        rules={[{ required: true, message: 'Thiếu câu trả lời' }]}
                                        className="mb-0"
                                    >
                                        <Input placeholder="Nội dung câu trả lời" />
                                    </Form.Item>
                                </Card>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Thêm câu hỏi bảo mật
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

            </Form>
        </Modal>
    );
}
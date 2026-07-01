"use client";

import { Modal, Form, Input, DatePicker, Button, Space, Card, Row, Col, Select } from "antd";
import { useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AppleIdData, { FormAppleIdData } from "@/libs/interfaces/appleIdData";
import { useAppleIdHook } from "@/libs/hooks/users/appleIdHook";
import useCountries from "@/libs/hooks/useCountries";

interface AppleIdFormModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    data: AppleIdData | null;
}

export default function AppleIdFormModal({
    isModalOpen,
    setIsModalOpen,
    data,
}: AppleIdFormModalProps) {
    const [formData] = Form.useForm();
    const { countries } = useCountries();
    const { createAppleIdAccount, updateAppleIdAccount, isCreatingAppleId, isUpdatingAppleId } = useAppleIdHook();

    const handleOk = async () => {
        try {
            const values = await formData.validateFields();
            const payload: FormAppleIdData = {
                ...values,
                birthday: values.birthday ? dayjs(values.birthday).format("YYYY-MM-DD") : "",
            };

            if (data) {
                const response = await updateAppleIdAccount({ id: data._id, payload });
                if (!response.status) return;
            } else {
                const response = await createAppleIdAccount(payload);
                if (!response.status) return;
            }

            formData.resetFields();
            setIsModalOpen(false);
        } catch (error: unknown) {
            if (error && typeof error === "object" && "errorFields" in error) return;
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        formData.resetFields();
    };

    useEffect(() => {
        if (isModalOpen) {
            if (data) {
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
            confirmLoading={isCreatingAppleId || isUpdatingAppleId}
            title={
                <p className="text-center text-lg font-semibold">
                    {data ? "Cập nhật tài khoản Apple ID" : "Thêm mới tài khoản Apple ID"}
                </p>
            }
            okText="Lưu"
            cancelText="Hủy"
            width={800}
        >
            <Form
                form={formData}
                style={{ marginTop: 20 }}
                layout="vertical"
                className="w-full"
                autoComplete="off"
            >
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

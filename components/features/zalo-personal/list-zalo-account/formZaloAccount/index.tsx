import { createZaloPersonalAccount, updateZaloPersonalAccount } from "@/libs/api-client/zalo-personal.api";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import ZaloPersonalData, { ZaloPersonalDataFormData, ZaloPersonalDataUpdateData } from "@/libs/intefaces/zaloPersonalData";
import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

interface FormZaloAccountProps {
    isShowModal?: boolean;
    onCloseModal?: () => void;
    dataForm?: ZaloPersonalData | null;
    handleAddSuccess: (newAccount: ZaloPersonalData) => void;
    handleUpdateSuccess: (updatedAccount: ZaloPersonalData) => void;
}

export default function FormZaloAccount({ isShowModal, onCloseModal, dataForm, handleAddSuccess, handleUpdateSuccess }: FormZaloAccountProps) {
    const [formData] = Form.useForm();
    const { notification } = useAntdApp();


    const handleSaveData = async () => {
        try {
            const values = await formData.validateFields();
            let response;
            if (dataForm) {
                const updatedAccount: ZaloPersonalDataUpdateData = {
                    ...dataForm,
                    ...values,
                };
                response = await updateZaloPersonalAccount(dataForm._id, updatedAccount);
                if (response.status) {
                    handleUpdateSuccess(response.data);
                }
            } else {
                const newAccount: ZaloPersonalDataFormData = {
                    ...values,
                };
                response = await createZaloPersonalAccount(newAccount);
                if (response.status) {
                    handleAddSuccess(response.data);
                }
            }

            if (response && !response.status) {
                notification.error({
                    message: 'Error',
                    description: response.message || 'An error occurred while saving data.',
                });
                return;
            } else {
                notification.success({
                    message: 'Success',
                    description: 'Data saved successfully',
                });
            }
            formData.resetFields();
            if (onCloseModal) onCloseModal();
        } catch (errorInfo) {
            console.log('Failed to save data:', errorInfo);
        }
    }

    useEffect(() => {
        if (dataForm) {
            formData.setFieldsValue(dataForm);
        } else {
            formData.resetFields();
        }
    }, [dataForm, formData, isShowModal]);

    
    return (
        <Modal
            title={dataForm ? "Cập nhật tài khoản Zalo" : "Thêm tài khoản Zalo"}
            open={isShowModal}
            onCancel={() => {
                if (onCloseModal) onCloseModal();
            }}
            onOk={handleSaveData}
        >
            <Form form={formData} layout="vertical">
                <Form.Item label="Họ tên" name="display_name">
                    <Input type="text" className="w-full border border-gray-300 rounded px-2 py-1" />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                    <Input type="text" className="w-full border border-gray-300 rounded px-2 py-1" />
                </Form.Item>
                <Form.Item label="Mật khẩu" name="password">
                    <Input type="text" className="w-full border border-gray-300 rounded px-2 py-1" />
                </Form.Item>
                {
                    dataForm && (
                        <>
                            <Form.Item label="imei" name="imei">
                                <Input type="text" className="w-full border border-gray-300 rounded px-2 py-1" />
                            </Form.Item>
                            <Form.Item label="secret_key" name="secret_key">
                                <Input type="text" className="w-full border border-gray-300 rounded px-2 py-1" />
                            </Form.Item>
                            <Form.Item label="cookie" name="cookie">
                                <Input.TextArea rows={5} className="w-full border border-gray-300 rounded px-2 py-1" />
                            </Form.Item>
                        </>
                    )
                }
            </Form>
        </Modal>
    )
}
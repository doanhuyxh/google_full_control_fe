import { useZaloPersonalAccount } from "@/libs/hooks/users/zaloPersonalAccountHook";
import ZaloPersonalData, { ZaloPersonalDataFormData, ZaloPersonalDataUpdateData } from "@/libs/interfaces/zaloPersonal";
import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

interface FormZaloAccountProps {
    isShowModal?: boolean;
    onCloseModal?: () => void;
    dataForm?: ZaloPersonalData | null;
}

export default function FormZaloAccount({ isShowModal, onCloseModal, dataForm }: FormZaloAccountProps) {
    const [formData] = Form.useForm();
    const { createZaloPersonalAccount, updateZaloPersonalAccount, isCreatingZalo, isUpdatingZalo } = useZaloPersonalAccount();

    const handleSaveData = async () => {
        try {
            const values = await formData.validateFields();
            if (dataForm) {
                const updatedAccount: ZaloPersonalDataUpdateData = {
                    display_name: values.display_name,
                    phoneNumber: values.phoneNumber,
                    password: values.password,
                    imei: values.imei,
                    secret_key: values.secret_key,
                    cookie: values.cookie,
                };
                const response = await updateZaloPersonalAccount({ id: dataForm._id, payload: updatedAccount });
                if (!response.status) return;
            } else {
                const newAccount: ZaloPersonalDataFormData = { ...values };
                const response = await createZaloPersonalAccount(newAccount);
                if (!response.status) return;
            }

            formData.resetFields();
            if (onCloseModal) onCloseModal();
        } catch (errorInfo) {
            console.log('Failed to save data:', errorInfo);
        }
    };

    useEffect(() => {
        if (!isShowModal) return;
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
            onCancel={() => onCloseModal?.()}
            onOk={handleSaveData}
            confirmLoading={isCreatingZalo || isUpdatingZalo}
            className="text-center"
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
                {dataForm && (
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
                )}
            </Form>
        </Modal>
    );
}

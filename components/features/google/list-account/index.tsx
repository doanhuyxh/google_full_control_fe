"use client";

import { Table, Avatar, Button, Input, Select, Tooltip, Modal, Card } from "antd";
import { useEffect, useState } from "react";
import { EyeFilled, DeleteOutlined } from "@ant-design/icons";
import { History } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { useGoogleAccount } from "@/libs/hooks/users/googleAccoutHook";
import { useToolsDataBackEnd } from "@/libs/hooks/useToolsDataBackEnd";
import { useCommon } from "@/libs/hooks/useCommon";
import { useDynamicAntdTableScrollHeight } from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { GoogleAccount, GoogleAccountStatusOptions } from "@/libs/intefaces/googleData";
import { updateGoogleAccount, deleteGoogleAccount } from "@/libs/network/google.api";
import GoogleAccountFilter from "./filter";
import GoogleFormModal from "./form";
import GoogleFormSendEmail from "./form-send-email";
import ViewHistoryEmailSent from "./view-history-email-sent";
import DebouncedInputCell from "@/components/common/AntCustom/DebouncedInputCell";
import DebouncedInputTextAreaCell from "@/components/common/AntCustom/DebounceInputTextAreaCel";

export default function GoogleAccountComponent() {
    const {
        accountData,
        loadingGoogle,
        pageGoogle,
        setPageGoogle,
        limitGoogle,
        setLimitGoogle,
        statusGoogle,
        setStatusGoogle,
        searchGoogle,
        setSearchGoogle,
        totalItemsGoogle,
        fetchGoogleAccounts,
        removeGoogleAccountById,
        handleUpdateDataLocal
    } = useGoogleAccount();

    const [isShowModalHistoryEmail, setIsShowModalHistoryEmail] = useState<boolean>(false);
    const [emailShowHistory, setEmailShowHistory] = useState<{ emailName?: string, googleAccountId?: string }>({});
    const [showModalPassword, setShowModalPassword] = useState<{ isShow: boolean; password?: string, id?: string }>({ isShow: false, password: '', id: '' });
    const { decodeData } = useToolsDataBackEnd();
    const { copiedToClipboard } = useCommon();
    const { notification, modal } = useAntdApp();

    const [formDataModal, setFormDataModal] = useState<{
        isShowModal: boolean;
        _id?: string;
    }>({ isShowModal: false, _id: undefined });

    const [isShowModelSendEmail, setIsShowModelSendEmail] = useState<boolean>(false);

    const handleViewPassword = async (encodedPassword: string) => {
        const decoded = await decodeData(encodedPassword);
        await copiedToClipboard(decoded);
    };

    const handleUpdateData = async (id: string, field: string, value: any) => {
        if (value === undefined || value === null || value === '') return;
        const response = await updateGoogleAccount(id, field, value);
        if (response.status) {
            notification.success({
                message: 'Cập nhật thành công',
                description: 'Dữ liệu đã được cập nhật thành công.',
                placement: 'topRight',
            });
            if (field === 'currentPassword') {
                handleUpdateDataLocal(id, field as keyof GoogleAccount, value);
            }
        } else {
            notification.error({
                message: 'Cập nhật thất bại',
                description: response.message || 'Đã có lỗi xảy ra khi cập nhật dữ liệu.',
                placement: 'topRight',
            });
        }
    }

    const handleFormModal = () => {
        setFormDataModal({ isShowModal: true, _id: undefined });
    }

    const handleDeleteAccount = async (id: string) => {
        const response = await deleteGoogleAccount(id);
        if (response.status) {
            notification.success({
                message: 'Xóa thành công',
                description: 'Tài khoản đã được xóa thành công.',
                placement: 'topRight',
            });
            removeGoogleAccountById(id);
        } else {
            notification.error({
                message: 'Xóa thất bại',
                description: response.message || 'Đã có lỗi xảy ra khi xóa tài khoản.',
                placement: 'topRight',
            });
        }
    }

    const handleShowEmailHistoryModal = (googleAccountId: string, emailName?: string) => {
        setEmailShowHistory({ googleAccountId, emailName });
        setIsShowModalHistoryEmail(true);
    }


    const columns: ColumnsType<GoogleAccount> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (_: any, __: any, index: number) => (pageGoogle - 1) * limitGoogle + index + 1,
        },
        {
            title: 'AVATAR',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 100,
            render: (avatar: string) => <Avatar src={avatar || 'https://via.placeholder.com/150'} alt="Ảnh đại diện" size={50} />,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
            render: (fullName: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={fullName}
                    dataIndex="fullName"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            render: (email: string) => (
                <span className="text-sm">{email}</span>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 180,
            render: (phoneNumber: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={phoneNumber}
                    dataIndex="phoneNumber"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: 'Mật khẩu',
            dataIndex: 'currentPassword',
            key: 'currentPassword',
            width: 100,
            render: (currentPassword: string) => (
                <Button type="default" size="small" icon={<EyeFilled />} onClick={() => handleViewPassword(currentPassword)} />
            ),
        },
        {
            title: 'App Password',
            dataIndex: 'appPassword',
            key: 'appPassword',
            width: 200,
            render: (appPassword: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={appPassword}
                    dataIndex="appPassword"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: 'Email khôi phục',
            dataIndex: 'recoveryEmail',
            key: 'recoveryEmail',
            width: 250,
            render: (recoveryEmail: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={recoveryEmail}
                    dataIndex="recoveryEmail"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: 'Recovery Phone',
            dataIndex: 'recoveryPhoneNumber',
            key: 'recoveryPhoneNumber',
            width: 180,
            render: (recoveryPhoneNumber: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={recoveryPhoneNumber}
                    dataIndex="recoveryPhoneNumber"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: 'F2A',
            dataIndex: 'f2a',
            key: 'f2a',
            width: 200,
            render: (f2a: string, record: GoogleAccount) => {
                return <DebouncedInputCell
                    recordId={record._id}
                    initialValue={f2a}
                    dataIndex="f2a"
                    onUpdate={handleUpdateData}
                    type="password"
                />
            },
        },
        {
            title: 'Mã bí mật',
            dataIndex: 'privateCode',
            key: 'privateCode',
            width: 300,
            render: (privateCode: string, record: GoogleAccount) => (
                <DebouncedInputTextAreaCell
                    recordId={record._id}
                    initialValue={privateCode}
                    dataIndex="privateCode"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 180,
            render: (status: string, record: GoogleAccount) => (
                <Select
                    size="small"
                    defaultValue={status}
                    style={{ width: '100%' }}
                    onChange={(value) => handleUpdateData(record._id, 'status', value)}
                    options={GoogleAccountStatusOptions}
                />
            ),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            width: 150,
            render: (note: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={note}
                    dataIndex="note"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (createdAt: Date) => (
                <span className="text-xs">{new Date(createdAt).toLocaleString()}</span>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 120,
            render: (_, record: GoogleAccount) => (
                <div className="flex gap-2 justify-end">
                    <Tooltip title="Cập nhật mật khẩu">
                        <Button
                            type="primary"
                            size="small"
                            icon={<EyeFilled />}
                            onClick={() => {
                                setShowModalPassword({ isShow: true, password: '', id: record._id });
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Lịch sử gửi email từ hệ thống">
                        <Button
                            type="dashed"
                            size="small"
                            icon={<History />}
                            onClick={() => handleShowEmailHistoryModal(record._id, record.email)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa tài khoản">
                        <Button
                            danger
                            type="primary"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                modal.confirm({
                                    title: 'Xác nhận xóa',
                                    content: `Bạn có chắc chắn muốn xóa tài khoản ${record.email}?`,
                                    okText: 'Xóa',
                                    okType: 'danger',
                                    cancelText: 'Hủy',
                                    onOk() {
                                        handleDeleteAccount(record._id);
                                    },
                                });
                            }}
                        />
                    </Tooltip>
                </div>
            ),
        }
    ]

    useEffect(() => {
        fetchGoogleAccounts();
    }, [pageGoogle, limitGoogle, statusGoogle, searchGoogle]);

    return (
        <Card className="w-full p-6 rounded-lg shadow-lg">
            <GoogleAccountFilter
                value={searchGoogle}
                onSearch={(value: string) => {
                    setSearchGoogle(value)
                }}
                status={statusGoogle}
                handleFormModal={handleFormModal}
                handleSendEmailModal={() => setIsShowModelSendEmail(true)}
                setStatus={setStatusGoogle} />
            <Table
                columns={columns}
                dataSource={accountData}
                loading={loadingGoogle}
                rowKey={(record) => record._id}
                pagination={{
                    current: pageGoogle,
                    pageSize: limitGoogle,
                    total: totalItemsGoogle,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 30, 50, 100],
                    onChange: (page, pageSize) => {
                        setPageGoogle(page);
                        setLimitGoogle(pageSize);
                    },
                    showTotal(total, range) {
                        return `Hiển thị ${range[0]} - ${range[1]} của ${total} tài khoản`;
                    },
                }}
                scroll={{
                    x: "max-content",
                    y: useDynamicAntdTableScrollHeight()
                }}
            />
            <GoogleFormModal
                isShowModal={formDataModal.isShowModal}
                onCloseModal={() => setFormDataModal({ isShowModal: false })}
                accountId={formDataModal._id}
                onSuccess={fetchGoogleAccounts}
            />
            <GoogleFormSendEmail
                isShowModal={isShowModelSendEmail}
                onCloseModal={() => setIsShowModelSendEmail(false)}
            />
            <ViewHistoryEmailSent
                isShowModal={isShowModalHistoryEmail}
                onCloseModal={() => setIsShowModalHistoryEmail(false)}
                googleAccountId={emailShowHistory.googleAccountId || ''}
                emailName={emailShowHistory.emailName || ''}
            />

            <Modal
                open={showModalPassword.isShow}
                onCancel={() => setShowModalPassword({ isShow: false, password: '' })}
                onOk={async () => {
                    await handleUpdateData(showModalPassword.id || '', 'currentPassword', showModalPassword.password);
                    setShowModalPassword({ isShow: false, password: '' });
                }}
            >
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-medium">Mật khẩu mới</h3>
                    <Input.Password
                        value={showModalPassword.password}
                        onChange={(e) => setShowModalPassword({ ...showModalPassword, password: e.target.value })}
                        placeholder="Nhập mật khẩu mới"
                    />
                </div>
            </Modal>
        </Card>
    )
}
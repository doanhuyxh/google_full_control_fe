"use client";

import { Table, Avatar, Button, Input, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { EyeFilled, DeleteOutlined } from "@ant-design/icons";
import { History, Mail } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { useGoogleAccount } from "@/libs/hooks/users/googleAccoutHook";
import { useToolsDataBackEnd } from "@/libs/hooks/useToolsDataBackEnd";
import { useCommon } from "@/libs/hooks/useCommon";
import { useDynamicAntdTableScrollHeight } from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { GoogleAccount } from "@/libs/intefaces/googleData";
import { updateGoogleAccount, deleteGoogleAccount } from "@/libs/api-client/google.api";
import GoogleAccountFilter from "./filter";
import GoogleFormModal from "./form";
import GoogleFormSendEmail from "./form-send-email";

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
        removeGoogleAccountById
    } = useGoogleAccount();

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
        const response = await updateGoogleAccount(id, field, value);
        if (response.status) {
            notification.success({
                message: 'Cập nhật thành công',
                description: 'Dữ liệu đã được cập nhật thành công.',
                placement: 'topRight',
            });
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

    useEffect(() => {
        fetchGoogleAccounts();
    }, [pageGoogle, limitGoogle, statusGoogle, searchGoogle]);

    

    const columns: ColumnsType<GoogleAccount> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (_: any, __: any, index: number) => (pageGoogle - 1) * limitGoogle + index + 1,
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 80,
            render: (avatar: string) => <Avatar src={avatar || 'https://via.placeholder.com/150'} alt="Avatar" size={50} />,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 150,
            render: (fullName: string, record: GoogleAccount) => (
                <Input
                    size="small"
                    defaultValue={fullName}
                    style={{ width: '100%' }}
                    onBlur={(e) => handleUpdateData(record._id, 'fullName', e.target.value)}
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
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 180,
            render: (phoneNumber: string, record: GoogleAccount) => (
                <Input
                    size="small"
                    defaultValue={phoneNumber}
                    style={{ width: '100%' }}
                    onBlur={(e) => handleUpdateData(record._id, 'phoneNumber', e.target.value)}
                />
            ),
        },
        {
            title: 'Password',
            dataIndex: 'currentPassword',
            key: 'currentPassword',
            width: 40,
            render: (currentPassword: string) => (
                <Button
                    type="text"
                    size="small"
                    icon={<EyeFilled />}
                    onClick={() => handleViewPassword(currentPassword)}
                    style={{ padding: '4px' }}
                />
            ),
        },
        {
            title: 'App Password',
            dataIndex: 'appPassword',
            key: 'appPassword',
            width: 150,
            render: (appPassword: string, record: GoogleAccount) => (
                <Input
                    size="small"
                    defaultValue={appPassword}
                    style={{ width: '100%' }}
                    onBlur={(e) => handleUpdateData(record._id, 'appPassword', e.target.value)}
                />
            ),
        },
        {
            title: 'Private Code',
            dataIndex: 'privateCode',
            key: 'privateCode',
            width: 120,
            render: (privateCode: string, record: GoogleAccount) => (
                <Input
                    size="small"
                    defaultValue={privateCode}
                    style={{ width: '100%' }}
                    onBlur={(e) => handleUpdateData(record._id, 'privateCode', e.target.value)}
                />
            ),
        },
        {
            title: 'Recovery Email',
            dataIndex: 'recoveryEmail',
            key: 'recoveryEmail',
            width: 180,
            render: (recoveryEmail: string, record: GoogleAccount) => (
                <Input
                    size="small"
                    defaultValue={recoveryEmail}
                    style={{ width: '100%' }}
                    onBlur={(e) => handleUpdateData(record._id, 'recoveryEmail', e.target.value)}
                />
            ),
        },
        {
            title: 'Recovery Phone',
            dataIndex: 'recoveryPhoneNumber',
            key: 'recoveryPhoneNumber',
            width: 180,
            render: (recoveryPhoneNumber: string, record: GoogleAccount) => (
                <Input
                    size="small"
                    defaultValue={recoveryPhoneNumber}
                    style={{ width: '100%' }}
                    onBlur={(e) => handleUpdateData(record._id, 'recoveryPhoneNumber', e.target.value)}
                />
            ),
        },
        {
            title: 'F2A',
            dataIndex: 'f2a',
            key: 'f2a',
            width: 120,
            render: (f2a: string, record: GoogleAccount) => (
                <Input
                    size="small"
                    defaultValue={f2a}
                    style={{ width: '100%' }}
                    onBlur={(e) => handleUpdateData(record._id, 'f2a', e.target.value)}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string, record: GoogleAccount) => (
                <Select
                    size="small"
                    defaultValue={status}
                    style={{ width: '100%' }}
                    onChange={(value) => handleUpdateData(record._id, 'status', value)}
                    options={[
                        { value: 'live', label: 'Live' },
                        { value: 'suspended', label: 'Suspended' },
                    ]}
                />
            ),
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            width: 150,
            render: (note: string, record: GoogleAccount) => (
                <Input
                    size="small"
                    defaultValue={note}
                    style={{ width: '100%' }}
                    onBlur={(e) => handleUpdateData(record._id, 'note', e.target.value)}
                />
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (createdAt: Date) => (
                <span className="text-xs">{new Date(createdAt).toLocaleString()}</span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_, record: GoogleAccount) => (
                <div className="flex gap-2">
                    <Tooltip title="Đọc Email">
                        <Button size="small" icon={<Mail />} />
                    </Tooltip>

                    <Tooltip title="History Email">
                        <Button size="small" icon={<History />} />
                    </Tooltip>

                    <Tooltip title="Delete Account">
                        <Button
                            danger
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

    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
            <GoogleAccountFilter
                value={searchGoogle}
                onSearch={setSearchGoogle}
                status={statusGoogle}
                handleFormModal={handleFormModal}
                handleSendEmailModal={() => setIsShowModelSendEmail(true)}
                setStatus={setStatusGoogle} />
            <Table
                columns={columns}
                dataSource={accountData}
                loading={loadingGoogle}
                rowKey="_id"
                rowClassName={(record: GoogleAccount) => {
                    if (record.status === 'live') {
                        return 'bg-green-50 border-l-4 border-green-500';
                    } else if (record.status === 'banned') {
                        return 'bg-red-50 border-l-4 border-red-500';
                    }
                    return '';
                }}
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
        </div>
    )
}
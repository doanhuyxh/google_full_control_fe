"use client";

import { Table, Avatar, Button, Select, Tooltip, Card } from "antd";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Copy, Download, History, QrCode, Upload } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { useGoogleAccount } from "@/libs/hooks/users/googleAccoutHook";
import { useCommon } from "@/libs/hooks/useCommon";
import { useDynamicAntdTableScrollHeight } from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { GoogleAccount, GoogleAccountStatusOptions } from "@/libs/interfaces/googleData";
import GoogleAccountFilter from "./filter";
import GoogleFormModal from "./form";
import GoogleFormSendEmail from "./form-send-email";
import ViewHistoryEmailSent from "./view-history-email-sent";
import DebouncedInputCell from "@/components/common/AntCustom/DebouncedInputCell";
import DebouncedInputTextAreaCell from "@/components/common/AntCustom/DebounceInputTextAreaCel";
import Update2FAModal from "./update-2fa-modal";
import ModalImportCookieStringForm from "./form-import-cookie-string";

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
        updateGoogleField,
        deleteGoogleAccount,
    } = useGoogleAccount();

    const [isShowModalHistoryEmail, setIsShowModalHistoryEmail] = useState<boolean>(false);
    const [emailShowHistory, setEmailShowHistory] = useState<{ emailName?: string, googleAccountId?: string }>({});
    const { copiedToClipboard } = useCommon();
    const { notification, modal } = useAntdApp();

    const [formDataModal, setFormDataModal] = useState<{
        isShowModal: boolean;
        _id?: string;
    }>({ isShowModal: false, _id: undefined });

    const [formModalUpdate2FA, setFormModalUpdate2FA] = useState<{
        isShowModal: boolean;
        _id?: string;
    }>({ isShowModal: false, _id: undefined });

    const [isShowModelSendEmail, setIsShowModelSendEmail] = useState<boolean>(false);
    const [cookieModal, setCookieModal] = useState<{ isShow: boolean; id?: string; cookies: string }>({
        isShow: false,
        id: undefined,
        cookies: "",
    });

    const handleDownloadCookies = (record: GoogleAccount) => {
        if (!record.cookies) {
            notification.warning({
                message: "Không có cookies",
                description: "Tài khoản này chưa có dữ liệu cookies để tải.",
                placement: "topRight",
            });
            return;
        }

        const safeName = `${record.email || record._id}-cookies.txt`.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = new Blob([record.cookies], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = safeName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    };

    const handleSaveCookies = async () => {
        const id = cookieModal.id || "";
        const cookieValue = cookieModal.cookies.trim();

        if (!id || !cookieValue) {
            notification.warning({
                message: "Thiếu dữ liệu",
                description: "Vui lòng nhập cookies trước khi lưu.",
                placement: "topRight",
            });
            return;
        }

        const response = await updateGoogleField(id, "cookies", cookieValue);
        if (response?.status) {
            setCookieModal({ isShow: false, id: undefined, cookies: "" });
        }
    };

    const handleUpdateData = async (id: string, field: string, value: unknown) => {
        await updateGoogleField(id, field, value);
    };

    const handleDeleteAccount = async (id: string) => {
        await deleteGoogleAccount(id);
    };

    const handleFormModal = () => {
        setFormDataModal({ isShowModal: true, _id: undefined });
    }

    const handleShowEmailHistoryModal = (googleAccountId: string, emailName?: string) => {
        setEmailShowHistory({ googleAccountId, emailName });
        setIsShowModalHistoryEmail(true);
    }

    const renderPasswordCell = (value: string, record: GoogleAccount, dataIndex: string) => (
        <div className="flex gap-2">
            <DebouncedInputCell
                recordId={record._id}
                initialValue={value}
                dataIndex={dataIndex}
                onUpdate={handleUpdateData}
                type="password"
            />
            <Button
                type="default"
                size="small"
                icon={<Copy size={12} color="#06477d" />}
                onClick={() => copiedToClipboard(value)}
            />
        </div>
    );

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
            render: (avatar: string) => <Avatar src={avatar || 'https://via.placeholder.com/150'} alt="Ảnh đại diện" size={30} />,
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
            width: 220,
            render: (currentPassword: string, record: GoogleAccount) =>
                renderPasswordCell(currentPassword, record, "currentPassword"),
        },
        {
            title: 'App Password',
            dataIndex: 'appPassword',
            key: 'appPassword',
            width: 220,
            render: (appPassword: string, record: GoogleAccount) =>
                renderPasswordCell(appPassword, record, "appPassword"),
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
            width: 220,
            render: (f2a: string, record: GoogleAccount) =>
                renderPasswordCell(f2a, record, "f2a"),
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
                    <Tooltip title="Quét mã 2FA">
                        <Button
                            type="primary"
                            size="small"
                            icon={<QrCode size={16} />}
                            onClick={() => setFormModalUpdate2FA({ isShowModal: true, _id: record._id })}
                        />
                    </Tooltip>
                    <Tooltip title="Tải cookies">
                        <Button
                            size="small"
                            type="dashed"
                            icon={<Download color="blue" size={16} />}
                            onClick={() => handleDownloadCookies(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Nhập cookies">
                        <Button
                            size="small"
                            icon={<Upload size={16} />}
                            onClick={() =>
                                setCookieModal({
                                    isShow: true,
                                    id: record._id,
                                    cookies: record.cookies || "",
                                })
                            }
                        />
                    </Tooltip>
                    <Tooltip title="Lịch sử gửi email từ hệ thống">
                        <Button
                            type="dashed"
                            size="small"
                            icon={<History color="blue" size={16} />}
                            onClick={() => handleShowEmailHistoryModal(record._id, record.email)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa tài khoản">
                        <Button
                            danger
                            type="primary"
                            size="small"
                            icon={<DeleteOutlined color="red" size={16} />}
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
            <ModalImportCookieStringForm
                isShowModal={cookieModal.isShow}
                onCloseModal={() => setCookieModal({ isShow: false, id: undefined, cookies: "" })}
                onSuccess={handleSaveCookies}
                cookies={cookieModal.cookies}
                onChangeCookies={(cookies) => setCookieModal({ ...cookieModal, cookies })}
            />
            <Update2FAModal
                isShowModal={formModalUpdate2FA.isShowModal}
                accountId={formModalUpdate2FA._id}
                onClose={() => setFormModalUpdate2FA({ isShowModal: false })}
                onUpdate={handleUpdateData}
            />
        </Card>
    )
}

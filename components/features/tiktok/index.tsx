"use client";

import { Table, Button, Tooltip, Card } from "antd";
import { useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Copy, QrCode } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { useTikTokAccount } from "@/libs/hooks/users/tiktokAccountHook";
import { useCommon } from "@/libs/hooks/useCommon";
import { useDynamicAntdTableScrollHeight } from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import TikTokAccountData, { FormTikTokAccountData } from "@/libs/intefaces/tiktokData";
import { deleteTikTokAccount, updateTikTokAccount } from "@/libs/network/tiktok.api";
import TikTokFilter from "./TikTokFilter";
import TikTokFormModal from "./TikTokFormModal";
import TikTokUpdate2FAModal from "./Update2FAModal";
import DebouncedInputCell from "@/components/common/AntCustom/DebouncedInputCell";

export default function TikTokPageComponent() {
    const {
        listTikTokAccount,
        loadingTikTok,
        pageTikTok,
        setPageTikTok,
        limitTikTok,
        setLimitTikTok,
        searchTikTok,
        setSearchTikTok,
        totalItemsTikTok,
        fetchTikTokAccounts,
        removeTikTokAccountById,
        handleUpdateFieldLocal,
    } = useTikTokAccount();

    const { copiedToClipboard } = useCommon();
    const { notification, modal } = useAntdApp();

    const [formModal, setFormModal] = useState<{
        isShowModal: boolean;
        editData: TikTokAccountData | null;
    }>({ isShowModal: false, editData: null });

    const [formModal2FA, setFormModal2FA] = useState<{
        isShowModal: boolean;
        _id?: string;
    }>({ isShowModal: false, _id: undefined });


    const handleUpdateData = async (id: string, field: string, value: any) => {
        if (value === undefined || value === null || value === "") return;
        const currentAccount = listTikTokAccount.find((acc) => acc._id === id);
        if (!currentAccount) return;

        const formData: FormTikTokAccountData = {
            username: currentAccount.username,
            password: currentAccount.password,
            email: currentAccount.email,
            phoneNumber: currentAccount.phoneNumber,
            f2a: currentAccount.f2a,
            countryCode: currentAccount.countryCode,
            [field]: value,
        };
        const response = await updateTikTokAccount(id, formData);
        if (response.status) {
            notification.success({
                message: "Cập nhật thành công",
                description: "Dữ liệu đã được cập nhật thành công.",
                placement: "topRight",
            });
            handleUpdateFieldLocal(id, field as keyof TikTokAccountData, value);
        } else {
            notification.error({
                message: "Cập nhật thất bại",
                description: response.message || "Đã có lỗi xảy ra khi cập nhật dữ liệu.",
                placement: "topRight",
            });
        }
    };

    const handleDeleteAccount = async (id: string) => {
        const response = await deleteTikTokAccount(id);
        if (response.status) {
            notification.success({
                message: "Xóa thành công",
                description: "Tài khoản đã được xóa thành công.",
                placement: "topRight",
            });
            removeTikTokAccountById(id);
        } else {
            notification.error({
                message: "Xóa thất bại",
                description: response.message || "Đã có lỗi xảy ra khi xóa tài khoản.",
                placement: "topRight",
            });
        }
    };

    const columns: ColumnsType<TikTokAccountData> = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            width: 60,
            render: (_: any, __: any, index: number) =>
                (pageTikTok - 1) * limitTikTok + index + 1,
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            width: 220,
            render: (username: string, record: TikTokAccountData) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={username}
                    dataIndex="username"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: "Mật khẩu",
            dataIndex: "password",
            key: "password",
            width: 250,
            render: (password: string, record: TikTokAccountData) => (
                <div className="flex gap-2">
                    <DebouncedInputCell
                        recordId={record._id}
                        initialValue={password}
                        dataIndex="password"
                        onUpdate={handleUpdateData}
                        type="password"
                    />
                    <Button
                        icon={<Copy size={12} color="#06477d" />}
                        size="small"
                        onClick={() => copiedToClipboard(password)}
                    />
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 220,
            render: (email: string, record: TikTokAccountData) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={email}
                    dataIndex="email"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: 180,
            render: (phoneNumber: string, record: TikTokAccountData) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={phoneNumber}
                    dataIndex="phoneNumber"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: "2FA",
            dataIndex: "f2a",
            key: "f2a",
            width: 250,
            render: (f2a: string, record: TikTokAccountData) => (
                <div className="flex gap-2">
                    <DebouncedInputCell
                        recordId={record._id}
                        initialValue={f2a}
                        dataIndex="f2a"
                        onUpdate={handleUpdateData}
                        type="password"
                    />
                    <Button
                        icon={<Copy size={12} color="#06477d" />}
                        size="small"
                        onClick={() => copiedToClipboard(f2a)}
                    />
                </div>
            ),
        },
        {
            title: "Quốc gia",
            dataIndex: "countryCode",
            key: "countryCode",
            width: 120,
            render: (countryCode: string, record: TikTokAccountData) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={countryCode}
                    dataIndex="countryCode"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: "Hành động",
            key: "actions",
            width: 120,
            render: (_, record: TikTokAccountData) => (
                <div className="flex gap-2 justify-end">
                    <Tooltip title="Quét mã 2FA">
                        <Button
                            size="small"
                            icon={<QrCode size={16} />}
                            onClick={() =>
                                setFormModal2FA({ isShowModal: true, _id: record._id })
                            }
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() =>
                                setFormModal({ isShowModal: true, editData: record })
                            }
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
                                    title: "Xác nhận xóa",
                                    content: `Bạn có chắc chắn muốn xóa tài khoản ${record.username}?`,
                                    okText: "Xóa",
                                    okType: "danger",
                                    cancelText: "Hủy",
                                    onOk() {
                                        handleDeleteAccount(record._id);
                                    },
                                });
                            }}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <Card className="w-full p-6 rounded-lg shadow-lg">
            <TikTokFilter
                value={searchTikTok}
                onSearch={(value: string) => setSearchTikTok(value)}
                handleFormModal={() =>
                    setFormModal({ isShowModal: true, editData: null })
                }
            />
            <Table
                columns={columns}
                dataSource={listTikTokAccount}
                loading={loadingTikTok}
                rowKey={(record) => record._id}
                pagination={{
                    current: pageTikTok,
                    pageSize: limitTikTok,
                    total: totalItemsTikTok,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 30, 50, 100],
                    onChange: (page, pageSize) => {
                        setPageTikTok(page);
                        setLimitTikTok(pageSize);
                    },
                    showTotal(total, range) {
                        return `Hiển thị ${range[0]} - ${range[1]} của ${total} tài khoản`;
                    },
                }}                                                                                                                                                                                      
                scroll={{
                    x: "max-content",
                    y: useDynamicAntdTableScrollHeight(),
                }}
            />
            <TikTokFormModal
                isShowModal={formModal.isShowModal}
                onCloseModal={() =>
                    setFormModal({ isShowModal: false, editData: null })
                }
                editData={formModal.editData}
                onSuccess={fetchTikTokAccounts}
            />
            <TikTokUpdate2FAModal
                isShowModal={formModal2FA.isShowModal}
                accountId={formModal2FA._id}
                onClose={() => setFormModal2FA({ isShowModal: false })}
                onUpdate={handleUpdateData}
            />
        </Card>
    );
}
"use client";

import { useState } from "react";
import { Button, Card, Checkbox, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Copy } from "lucide-react";
import type { Key } from "react";

import DebouncedInputCell from "@/components/common/AntCustom/DebouncedInputCell";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { useCommon } from "@/libs/hooks/useCommon";
import { useDynamicAntdTableScrollHeight } from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import { useRevidApiAccount } from "@/libs/hooks/users/revidapiAccountHook";
import RevapiData from "@/libs/interfaces/revapiData";
import RevidApiFilter from "./RevidApiFilter";
import RevidApiFormModal from "./RevidApiFormModal";
import RevidApiImportModal from "./RevidApiImportModal";

export default function RevidApiComponent() {
    const {
        listRevidApiAccount,
        loadingRevidApi,
        pageRevidApi,
        setPageRevidApi,
        limitRevidApi,
        setLimitRevidApi,
        searchRevidApi,
        setSearchRevidApi,
        totalItemsRevidApi,
        deleteRevidApiAccount,
        updateRevidApiField,
        bulkLoginRevidApi,
        bulkApiKeyRevidApi,
        bulkCreditRevidApi,
        syncAllRevidApi,
        isBulkLoading,
    } = useRevidApiAccount();

    const { copiedToClipboard } = useCommon();
    const { notification, modal } = useAntdApp();

    const [formModal, setFormModal] = useState<{
        isShowModal: boolean;
        editData: RevapiData | null;
    }>({ isShowModal: false, editData: null });
    const [isShowImportModal, setIsShowImportModal] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    const handleUpdateData = async (id: string, field: string, value: string) => {
        await updateRevidApiField(id, field, value);
    };

    const handleDeleteAccount = async (id: string) => {
        await deleteRevidApiAccount(id);
    };

    const ensureSelectedIds = () => {
        if (!selectedRowKeys.length) {
            notification.warning({
                message: "Chưa chọn tài khoản",
                description: "Vui lòng tick checkbox để chọn tài khoản cần đồng bộ.",
            });
            return null;
        }
        return selectedRowKeys.map((key) => String(key));
    };

    const handleBulkLogin = async () => {
        const ids = ensureSelectedIds();
        if (!ids) return;
        await bulkLoginRevidApi(ids);
    };

    const handleBulkApiKey = async () => {
        const ids = ensureSelectedIds();
        if (!ids) return;
        await bulkApiKeyRevidApi(ids);
    };

    const handleBulkCredit = async () => {
        const ids = ensureSelectedIds();
        if (!ids) return;
        await bulkCreditRevidApi(ids);
    };

    const handleSyncAllActive = async () => {
        const ids = ensureSelectedIds();
        if (!ids) return;
        await syncAllRevidApi(ids);
    };

    const columns: ColumnsType<RevapiData> = [
        {
            dataIndex: "index",
            key: "index",
            width: 100,
            title: (
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={
                            listRevidApiAccount.length > 0
                            && selectedRowKeys.length === listRevidApiAccount.length
                        }
                        indeterminate={
                            selectedRowKeys.length > 0
                            && selectedRowKeys.length < listRevidApiAccount.length
                        }
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedRowKeys(listRevidApiAccount.map((item) => item._id));
                            } else {
                                setSelectedRowKeys([]);
                            }
                        }}
                    />
                    <span>STT</span>
                </div>
            ),
            render: (_: unknown, record: RevapiData, index: number) => (
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={selectedRowKeys.includes(record._id)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedRowKeys((prev) => [...prev, record._id]);
                            } else {
                                setSelectedRowKeys((prev) => prev.filter((key) => key !== record._id));
                            }
                        }}
                    />
                    <span>{(pageRevidApi - 1) * limitRevidApi + index + 1}</span>
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 230,
            render: (email: string, record: RevapiData) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={email}
                    dataIndex="email"
                    onUpdate={handleUpdateData}
                />
            ),
        },
        {
            title: "Mật khẩu",
            dataIndex: "password",
            key: "password",
            width: 250,
            render: (password: string, record: RevapiData) => (
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
            title: "Access Token",
            dataIndex: "access_token",
            key: "access_token",
            width: 280,
            render: (accessToken: string, record: RevapiData) => (
                <div className="flex gap-2">
                    <DebouncedInputCell
                        recordId={record._id}
                        initialValue={accessToken || ""}
                        dataIndex="access_token"
                        onUpdate={handleUpdateData}
                        type="password"
                    />
                    <Button
                        icon={<Copy size={12} color="#06477d" />}
                        size="small"
                        onClick={() => copiedToClipboard(accessToken || "")}
                    />
                </div>
            ),
        },
        {
            title: "API Key",
            dataIndex: "api_key",
            key: "api_key",
            width: 260,
            render: (apiKey: string, record: RevapiData) => (
                <div className="flex gap-2">
                    <DebouncedInputCell
                        recordId={record._id}
                        initialValue={apiKey || ""}
                        dataIndex="api_key"
                        onUpdate={handleUpdateData}
                        type="password"
                    />
                    <Button
                        icon={<Copy size={12} color="#06477d" />}
                        size="small"
                        onClick={() => copiedToClipboard(apiKey || "")}
                    />
                </div>
            ),
        },
        {
            title: "Credit",
            dataIndex: "credit",
            key: "credit",
            width: 110,
        },
        {
            title: "Hành động",
            key: "actions",
            width: 110,
            render: (_: unknown, record: RevapiData) => (
                <div className="flex gap-2 justify-end">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            size="small"
                            type="primary"
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
                                    content: `Bạn có chắc chắn muốn xóa tài khoản ${record.email}?`,
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
            <RevidApiFilter
                value={searchRevidApi}
                onSearch={(value: string) => setSearchRevidApi(value)}
                handleFormModal={() =>
                    setFormModal({ isShowModal: true, editData: null })
                }
                handleImportModal={() => setIsShowImportModal(true)}
                handleLoginActive={handleBulkLogin}
                handleApiKeyActive={handleBulkApiKey}
                handleCreditActive={handleBulkCredit}
                handleSyncAllActive={handleSyncAllActive}
                selectedCount={selectedRowKeys.length}
                bulkLoading={isBulkLoading}
            />

            <Table
                columns={columns}
                dataSource={listRevidApiAccount}
                loading={loadingRevidApi}
                rowKey={(record) => record._id}
                pagination={{
                    current: pageRevidApi,
                    pageSize: limitRevidApi,
                    total: totalItemsRevidApi,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 30, 50, 100],
                    onChange: (page, pageSize) => {
                        setPageRevidApi(page);
                        setLimitRevidApi(pageSize);
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

            <RevidApiFormModal
                isShowModal={formModal.isShowModal}
                onCloseModal={() =>
                    setFormModal({ isShowModal: false, editData: null })
                }
                editData={formModal.editData}
            />

            <RevidApiImportModal
                isShowModal={isShowImportModal}
                onCloseModal={() => setIsShowImportModal(false)}
            />
        </Card>
    );
}
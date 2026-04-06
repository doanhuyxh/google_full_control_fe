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
import RevapiData, { FormRevapiData } from "@/libs/intefaces/revapiData";
import {
    deleteRevapiData,
    getApiKeyInfo,
    getUpdateCredit,
    loginRevapiData,
    updateRevapiData,
} from "@/libs/network/revapi.api";

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
        fetchRevidApiAccounts,
        removeRevidApiAccountById,
        handleUpdateFieldLocal,
    } = useRevidApiAccount();

    const { copiedToClipboard } = useCommon();
    const { notification, modal } = useAntdApp();

    const [formModal, setFormModal] = useState<{
        isShowModal: boolean;
        editData: RevapiData | null;
    }>({ isShowModal: false, editData: null });
    const [isShowImportModal, setIsShowImportModal] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [bulkLoading, setBulkLoading] = useState<boolean>(false);

    const handleUpdateData = async (id: string, field: string, value: string) => {
        if (value === undefined || value === null || value === "") return;
        const currentAccount = listRevidApiAccount.find((acc) => acc._id === id);
        if (!currentAccount) return;

        const formData: FormRevapiData = {
            email: currentAccount.email,
            password: currentAccount.password,
            access_token: currentAccount.access_token,
            api_key: currentAccount.api_key,
            [field]: value,
        };

        const response = await updateRevapiData(id, formData);
        if (response.status) {
            notification.success({
                message: "Cập nhật thành công",
                description: "Dữ liệu đã được cập nhật thành công.",
            });
            handleUpdateFieldLocal(id, field as keyof RevapiData, value);
        } else {
            notification.error({
                message: "Cập nhật thất bại",
                description: response.message || "Đã có lỗi xảy ra khi cập nhật dữ liệu.",
            });
        }
    };

    const handleDeleteAccount = async (id: string) => {
        const response = await deleteRevapiData(id);
        if (response.status) {
            notification.success({
                message: "Xóa thành công",
                description: "Tài khoản đã được xóa thành công.",
            });
            removeRevidApiAccountById(id);
        } else {
            notification.error({
                message: "Xóa thất bại",
                description: response.message || "Đã có lỗi xảy ra khi xóa tài khoản.",
            });
        }
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
        setBulkLoading(true);
        const results = await Promise.all(ids.map((id) => loginRevapiData(id)));
        setBulkLoading(false);

        const successCount = results.filter((result) => result.status).length;
        if (successCount > 0) await fetchRevidApiAccounts();
        notification.info({
            message: "Kết quả Login active",
            description: `Thành công ${successCount}/${ids.length}`,
        });
    };

    const handleBulkApiKey = async () => {
        const ids = ensureSelectedIds();
        if (!ids) return;
        setBulkLoading(true);
        const results = await Promise.all(ids.map((id) => getApiKeyInfo(id)));
        setBulkLoading(false);

        const successCount = results.filter((result) => result.status).length;
        if (successCount > 0) await fetchRevidApiAccounts();
        notification.info({
            message: "Kết quả API Key active",
            description: `Thành công ${successCount}/${ids.length}`,
        });
    };

    const handleBulkCredit = async () => {
        const ids = ensureSelectedIds();
        if (!ids) return;
        setBulkLoading(true);
        const results = await Promise.all(ids.map((id) => getUpdateCredit(id)));
        setBulkLoading(false);

        const successCount = results.filter((result) => result.status).length;
        if (successCount > 0) await fetchRevidApiAccounts();
        notification.info({
            message: "Kết quả Lấy Credit",
            description: `Thành công ${successCount}/${ids.length}`,
        });
    };

    const handleSyncAllActive = async () => {
        const ids = ensureSelectedIds();
        if (!ids) return;
        setBulkLoading(true);
        const results = await Promise.all(
            ids.map(async (id) => {
                const loginRes = await loginRevapiData(id);
                if (!loginRes.status) {
                    return { success: false, reason: "login_failed" };
                }

                const accessToken = loginRes.data?.access_token;
                if (!accessToken || !String(accessToken).trim()) {
                    return { success: false, reason: "missing_access_token" };
                }

                const [apiKeyRes, creditRes] = await Promise.all([
                    getApiKeyInfo(id),
                    getUpdateCredit(id),
                ]);
                const success = apiKeyRes.status && creditRes.status;
                return {
                    success,
                    reason: success ? "ok" : "get_api_failed",
                };
            })
        );
        setBulkLoading(false);

        const successCount = results.filter((result) => result.success).length;
        const failedCount = results.length - successCount;
        const missingTokenCount = results.filter((result) => result.reason === "missing_access_token").length;

        if (successCount > 0) {
            await fetchRevidApiAccounts();
        }
        notification.info({
            message: "Kết quả Đồng bộ tất cả",
            description: `Thành công ${successCount}/${ids.length}. Thất bại ${failedCount}/${ids.length}. Thiếu access_token: ${missingTokenCount}.`,
        });
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
                bulkLoading={bulkLoading}
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
                onSuccess={fetchRevidApiAccounts}
            />

            <RevidApiImportModal
                isShowModal={isShowImportModal}
                onCloseModal={() => setIsShowImportModal(false)}
                onSuccess={fetchRevidApiAccounts}
            />
        </Card>
    );
}
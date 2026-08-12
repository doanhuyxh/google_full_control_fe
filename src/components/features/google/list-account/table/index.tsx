"use client";

import { Table, Avatar, Button, Select, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { Check, Copy, Download, History, QrCode, Upload } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { useCommon } from "@/libs/hooks/useCommon";
import { useDynamicAntdTableScrollHeight } from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { GoogleAccount, GoogleAccountResourcesUsedOptions, GoogleAccountStatusOptions, OAuth2Tokens } from "@/libs/interfaces/googleData";
import DebouncedInputCell from "@/components/common/AntCustom/DebouncedInputCell";
import DebouncedInputTextAreaCell from "@/components/common/AntCustom/DebounceInputTextAreaCel";
import { COLUMN_LABEL_BY_KEY } from "./column-options";

interface GoogleAccountTableProps {
    dataSource: GoogleAccount[];
    loading: boolean;
    page: number;
    pageSize: number;
    total: number;
    visibleColumns: string[];
    onPageChange: (page: number, pageSize: number) => void;
    onUpdate: (id: string, field: string, value: unknown) => void | Promise<unknown>;
    onDelete: (id: string) => void | Promise<unknown>;
    onDownloadCookies: (record: GoogleAccount) => void;
    onImportCookies: (record: GoogleAccount) => void;
    onUpdate2FA: (id: string) => void;
    onShowEmailHistory: (googleAccountId: string, emailName?: string) => void;
}

export default function GoogleAccountTable({
    dataSource,
    loading,
    page,
    pageSize,
    total,
    visibleColumns,
    onPageChange,
    onUpdate,
    onDelete,
    onDownloadCookies,
    onImportCookies,
    onUpdate2FA,
    onShowEmailHistory,
}: GoogleAccountTableProps) {
    const { copiedToClipboard, formatNumber, checkNullOrEmptyObject } = useCommon();
    const { modal } = useAntdApp();
    const tableScrollY = useDynamicAntdTableScrollHeight();

    const renderPasswordCell = (value: string, record: GoogleAccount, dataIndex: string) => (
        <div className="flex gap-2">
            <DebouncedInputCell
                recordId={record._id}
                initialValue={value}
                dataIndex={dataIndex}
                onUpdate={onUpdate}
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
            title: COLUMN_LABEL_BY_KEY.index,
            dataIndex: "index",
            key: "index",
            width: 60,
            render: (_: unknown, __: unknown, index: number) => (page - 1) * pageSize + index + 1,
        },
        {
            title: COLUMN_LABEL_BY_KEY.avatar,
            dataIndex: "avatar",
            key: "avatar",
            width: 100,
            render: (avatar: string) => (
                <Avatar src={avatar || "https://via.placeholder.com/150"} alt="Ảnh đại diện" size={30} />
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.fullName,
            dataIndex: "fullName",
            key: "fullName",
            width: 200,
            render: (fullName: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={fullName}
                    dataIndex="fullName"
                    onUpdate={onUpdate}
                />
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.email,
            dataIndex: "email",
            key: "email",
            width: 200,
            render: (email: string) => <span className="text-sm">{email}</span>,
        },
        {
            title: COLUMN_LABEL_BY_KEY.phoneNumber,
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: 180,
            render: (phoneNumber: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={phoneNumber}
                    dataIndex="phoneNumber"
                    onUpdate={onUpdate}
                />
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.currentPassword,
            dataIndex: "currentPassword",
            key: "currentPassword",
            width: 220,
            render: (currentPassword: string, record: GoogleAccount) =>
                renderPasswordCell(currentPassword, record, "currentPassword"),
        },
        {
            title: COLUMN_LABEL_BY_KEY.appPassword,
            dataIndex: "appPassword",
            key: "appPassword",
            width: 220,
            render: (appPassword: string, record: GoogleAccount) =>
                renderPasswordCell(appPassword, record, "appPassword"),
        },
        {
            title: COLUMN_LABEL_BY_KEY.oauthTwoTokens,
            dataIndex: "oauthTwoTokens",
            key: "oauthTwoTokens",
            width: 80,
            align: "center",
            render: (oauthTwoTokens: OAuth2Tokens) => {
                if (checkNullOrEmptyObject(oauthTwoTokens)) return "N/A";
                return <Check size={16} color="green" />;
            },
        },
        {
            title: COLUMN_LABEL_BY_KEY.recoveryEmail,
            dataIndex: "recoveryEmail",
            key: "recoveryEmail",
            width: 250,
            render: (recoveryEmail: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={recoveryEmail}
                    dataIndex="recoveryEmail"
                    onUpdate={onUpdate}
                />
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.recoveryPhoneNumber,
            dataIndex: "recoveryPhoneNumber",
            key: "recoveryPhoneNumber",
            width: 180,
            render: (recoveryPhoneNumber: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={recoveryPhoneNumber}
                    dataIndex="recoveryPhoneNumber"
                    onUpdate={onUpdate}
                />
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.f2a,
            dataIndex: "f2a",
            key: "f2a",
            width: 220,
            render: (f2a: string, record: GoogleAccount) => renderPasswordCell(f2a, record, "f2a"),
        },
        {
            title: COLUMN_LABEL_BY_KEY.privateCode,
            dataIndex: "privateCode",
            key: "privateCode",
            width: 300,
            render: (privateCode: string, record: GoogleAccount) => (
                <DebouncedInputTextAreaCell
                    recordId={record._id}
                    initialValue={privateCode}
                    dataIndex="privateCode"
                    onUpdate={onUpdate}
                />
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.resources_used,
            dataIndex: "resources_used",
            key: "resources_used",
            width: 180,
            render: (_: unknown, item: GoogleAccount) => (
                <Select
                    size="small"
                    mode="multiple"
                    defaultValue={item.resources_used}
                    style={{ width: "100%" }}
                    className="min-w-fit"
                    onChange={(value) => onUpdate(item._id, "resources_used", value)}
                    options={GoogleAccountResourcesUsedOptions}
                />
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.totalSendMailToday,
            dataIndex: "totalSendMailToday",
            key: "totalSendMailToday",
            width: 180,
            align: "center",
            render: (totalSendMailToday: string) => (
                <span className="text-xs">{formatNumber(totalSendMailToday)}</span>
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.totalDriverStrongUse,
            dataIndex: "totalDriverStrongUse",
            key: "totalDriverStrongUse",
            width: 180,
            align: "center",
            render: (totalDriverStrongUse: string) => (
                <span className="text-xs">{formatNumber(totalDriverStrongUse)}</span>
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.status,
            dataIndex: "status",
            key: "status",
            width: 180,
            render: (status: string, record: GoogleAccount) => (
                <Select
                    size="small"
                    defaultValue={status}
                    style={{ width: "100%" }}
                    onChange={(value) => onUpdate(record._id, "status", value)}
                    options={GoogleAccountStatusOptions}
                />
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.note,
            dataIndex: "note",
            key: "note",
            width: 150,
            render: (note: string, record: GoogleAccount) => (
                <DebouncedInputCell
                    recordId={record._id}
                    initialValue={note}
                    dataIndex="note"
                    onUpdate={onUpdate}
                />
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.createdAt,
            dataIndex: "createdAt",
            key: "createdAt",
            width: 180,
            render: (createdAt: Date) => (
                <span className="text-xs">{new Date(createdAt).toLocaleString()}</span>
            ),
        },
        {
            title: COLUMN_LABEL_BY_KEY.actions,
            key: "actions",
            width: 40,
            fixed: "right",
            render: (_: unknown, record: GoogleAccount) => {
                const items: MenuProps["items"] = [
                    {
                        key: "update-2fa",
                        icon: <QrCode size={14} />,
                        label: "Quét mã 2FA",
                        onClick: () => onUpdate2FA(record._id),
                    },
                    {
                        key: "download-cookies",
                        icon: <Download size={14} />,
                        label: "Tải cookies",
                        onClick: () => onDownloadCookies(record),
                    },
                    {
                        key: "import-cookies",
                        icon: <Upload size={14} />,
                        label: "Nhập cookies",
                        onClick: () => onImportCookies(record),
                    },
                    {
                        key: "email-history",
                        icon: <History size={14} />,
                        label: "Lịch sử gửi email",
                        onClick: () => onShowEmailHistory(record._id, record.email),
                    },
                    { type: "divider" },
                    {
                        key: "delete",
                        danger: true,
                        icon: <DeleteOutlined />,
                        label: "Xóa tài khoản",
                        onClick: () => {
                            modal.confirm({
                                title: "Xác nhận xóa",
                                content: `Bạn có chắc chắn muốn xóa tài khoản ${record.email}?`,
                                okText: "Xóa",
                                okType: "danger",
                                cancelText: "Hủy",
                                onOk() {
                                    onDelete(record._id);
                                },
                            });
                        },
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                        <Button type="text" size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    const visibleTableColumns = columns.filter((column) =>
        visibleColumns.includes(String(column.key)),
    );

    return (
        <Table
            columns={visibleTableColumns}
            dataSource={dataSource}
            loading={loading}
            rowKey={(record) => record._id}
            pagination={{
                current: page,
                pageSize,
                total,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 30, 50, 100],
                onChange: onPageChange,
                showTotal(totalItems, range) {
                    return `Hiển thị ${range[0]} - ${range[1]} của ${totalItems} tài khoản`;
                },
            }}
            scroll={{
                x: "max-content",
                y: tableScrollY,
            }}
            size="small"
        />
    );
}

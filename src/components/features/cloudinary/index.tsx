"use client";

import { useState } from "react";
import { Button, Card, Input, Popconfirm, Table, Tooltip } from "antd";
import { useCloudinaryAccount } from "@/libs/hooks/users/cloudinaryAccountHook";
import { CloudinaryData } from "@/libs/intefaces/cloudinaryData";

import CloudinaryControls from "./CloudinaryControls";
import CloudinaryFormModal from "./CloudinaryFormModal";
import useDynamicAntdTableScrollHeight from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import { formatUtcToLocal } from "@/libs/utils/timeUtils";
import { Edit3 } from "lucide-react";
import { DeleteFilled, BarChartOutlined } from "@ant-design/icons";
import { deleteCloudinaryAccount, getCloudinaryUsage } from "@/libs/network/cloudinary.api";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import CloudinaryUsageModal from "./CloudinaryUsageModal";

export default function CloudinaryComponent() {
    const {
        accountData,
        totalItemsCloudinary,
        pageCloudinary,
        searchCloudinary,
        setPageCloudinary,
        limitCloudinary,
        setLimitCloudinary,
        setSearchCloudinary,
        removeCloudinaryAccountById,
        addCloudinaryAccount,
        loadingCloudinary,
    } = useCloudinaryAccount();
    const { notification } = useAntdApp();
    const [isShowModalUsage, setIsShowModalUsage] = useState<boolean>(false);
    const [accountViewUsage, setAccountViewUsage] = useState<CloudinaryData | null>(null);
    const [dataCloudinaryUsage, setDataCloudinaryUsage] = useState<any | null>(null);
    const [waitLoadingDataCloudinaryUsage, setWaitLoadingDataCloudinaryUsage] = useState<boolean>(false);

    const [isModalOpenForm, setIsModalOpenForm] = useState(false);
    const [dataForm, setDataForm] = useState<CloudinaryData | null>(null);

    const handleFormModal = (data: CloudinaryData | null) => {
        setIsModalOpenForm(true);
        setDataForm(data);
    }

    const handleDeleteAccount = async (id: string) => {
        const response = await deleteCloudinaryAccount(id);
        if (!response.status) {
            notification.error({
                message: "Error",
                description: response.message || "An error occurred while deleting the Cloudinary account.",
            });
            return;
        }
        removeCloudinaryAccountById(id);
        notification.success({
            message: "Success",
            description: "Cloudinary account has been deleted successfully.",
        });
    }

    const handleShowUsageModal = async (cloudinaryId: string) => {
        setWaitLoadingDataCloudinaryUsage(true);
        const account = accountData.find(acc => acc._id === cloudinaryId) || null;
        setAccountViewUsage(account);
        const response = await getCloudinaryUsage(cloudinaryId);
        setWaitLoadingDataCloudinaryUsage(false);
        if (!response.status) {
            notification.error({
                message: "Error",
                description: response.message || "An error occurred while fetching Cloudinary usage data.",
            });
            return;
        }
        setDataCloudinaryUsage(response.data);
        setIsShowModalUsage(true);
    }

    const clolumns = [
        {
            title: "STT",
            dataIndex: "stt",
            render: (_: any, __: any, index: number) =>
                index + 1 + (pageCloudinary - 1) * limitCloudinary,
        },
        { title: "Email", dataIndex: "accountMail" },
        { title: "Cloud Name", dataIndex: "cloudName" },
        { title: "API Key", dataIndex: "apiKey", render: (apiKey: string) => <Input.Password value={apiKey} readOnly /> },
        { title: "API Secret", dataIndex: "apiSecret", render: (apiSecret: string) => <Input.Password value={apiSecret} readOnly /> },
        { title: "Ghi chú", dataIndex: "note" },
        { title: "Thời gian", dataIndex: "createdAt", render: (date: string) => formatUtcToLocal(date) },
        {
            title: "Hành động",
            dataIndex: "actions",
            render: (_: any, record: CloudinaryData) => (
                <div className="flex gap-2">
                    <Tooltip title="Cập nhật">
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => handleFormModal(record)}
                            icon={<Edit3 size={16} />}
                        />
                    </Tooltip>
                    <Tooltip title="Sử dụng">
                        <Button
                            size="small"
                            type="dashed"
                            onClick={() => handleShowUsageModal(record._id)}
                            icon={<BarChartOutlined />}
                            loading={waitLoadingDataCloudinaryUsage}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa tài khoản này?"
                            description="Hành động này không thể hoàn tác."
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => handleDeleteAccount(record._id)}
                        >
                            <Button
                                size="small"
                                type="primary"
                                danger
                                icon={<DeleteFilled size={16} />}
                            />
                        </Popconfirm>
                    </Tooltip>

                </div>
            ),
        },
    ];

    return (
        <Card className="w-full p-6 rounded-lg shadow-lg">
            <CloudinaryControls
                searchCloudinary={searchCloudinary}
                setSearchCloudinary={setSearchCloudinary}
                onAddClick={() => handleFormModal(null)}
            />
            <Table
                dataSource={accountData}
                rowKey="_id"
                columns={clolumns}
                loading={loadingCloudinary}
                pagination={{
                    current: pageCloudinary,
                    total: totalItemsCloudinary,
                    pageSizeOptions: ["10", "20", "30", "50", "100"],
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                        setPageCloudinary(page);
                        setLimitCloudinary(pageSize);
                    },
                    showTotal(total, range) {
                        return `Hiển thị ${range[0]} - ${range[1]} của ${total} tài khoản`;
                    },
                }}
                scroll={{
                    x: 'max-content',
                    y: useDynamicAntdTableScrollHeight()
                }}
            />
            <CloudinaryFormModal
                isModalOpen={isModalOpenForm}
                setIsModalOpen={setIsModalOpenForm}
                data={dataForm}
                addCloudinaryAccount={addCloudinaryAccount}
            />
            <CloudinaryUsageModal
                isModalOpen={isShowModalUsage}
                handleCancel={() => setIsShowModalUsage(false)}
                data={dataCloudinaryUsage}
                account={accountViewUsage}
            />
        </Card>
    );
}
"use client";

import { useState } from "react";
import { Button, Card, Popconfirm, Table, Tooltip } from "antd";

import useDynamicAntdTableScrollHeight from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import { formatUtcToLocal } from "@/libs/utils/timeUtils";
import { Edit3 } from "lucide-react";
import { DeleteFilled } from "@ant-design/icons";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import AppleIdData, { QuestionSecurity } from "@/libs/intefaces/appleIdData";
import { deleteAppleIDAccount } from "@/libs/network/appleId.api";
import { useAppleIdHook } from "@/libs/hooks/users/appleIdHook";
import AppleIdControls from "./AppleIdControls";
import AppleIdFormModal from "./AppleIdFormModal";
import useCountries from "@/libs/hooks/useCountries";

export default function AppleIdComponent() {
    const {
        accountData,
        totalItemsAppleId,
        pageAppleId,
        searchAppleId,
        setPageAppleId,
        limitAppleId,
        setLimitAppleId,
        setSearchAppleId,
        removeAppleIdAccountById,
        addAppleIdAccount,
        loadingAppleId,
    } = useAppleIdHook();
    const { notification } = useAntdApp();
    const { countries } = useCountries();


    const [isModalOpenForm, setIsModalOpenForm] = useState(false);
    const [dataForm, setDataForm] = useState<AppleIdData | null>(null);

    const handleFormModal = (data: AppleIdData | null) => {
        setIsModalOpenForm(true);
        setDataForm(data);
    }

    const handleDeleteAccount = async (id: string) => {
        const response = await deleteAppleIDAccount(id);
        if (!response.status) {
            notification.error({
                message: "Error",
                description: response.message || "An error occurred while deleting the Apple ID account.",
            });
            return;
        }
        removeAppleIdAccountById(id);
        notification.success({
            message: "Success",
            description: "Apple ID account has been deleted successfully.",
        });
    }


    const clolumns = [
        {
            title: "STT",
            dataIndex: "stt",
            render: (_: any, __: any, index: number) =>
                index + 1 + (pageAppleId - 1) * limitAppleId,
            width: 60,
        },
        { title: "Họ tên", dataIndex: "fullName" },
        { title: "Ngày sinh", dataIndex: "birthday" },
        { title: "Apple ID", dataIndex: "appleId" },
        { title: "Mật khẩu", dataIndex: "password" },
        { title: "Email", dataIndex: "email" },
        { title: "Số điện thoại", dataIndex: "phoneNumber" },
        {
            title: "Quốc gia", dataIndex: "countryCode", render: (countryCode: string) => {
                const country = countries.find(c => c.cca2 === countryCode || c.cca3 === countryCode || c.ccn3 === countryCode);
                return country ? country.name.common : countryCode;
            }
        },
        { title: "Địa chỉ", dataIndex: "address" },
        {
            title: "Câu hỏi bảo mật", dataIndex: "questionSecurity", render: (questionSecurity: QuestionSecurity[]) => (
                <ul>{questionSecurity.map((qs, index) => (
                    <li key={index}>
                        <strong>Câu hỏi:</strong> {qs.question} <br />
                        <strong>Trả lời:</strong> {qs.answer}
                    </li>
                ))}</ul>
            )
        },
        { title: "Thời gian", dataIndex: "createdAt", render: (date: string) => formatUtcToLocal(date) },
        {
            title: "Hành động",
            dataIndex: "actions",
            render: (_: any, record: AppleIdData) => (
                <div className="flex gap-2">
                    <Tooltip title="Cập nhật">
                        <Button
                            type="primary"
                            onClick={() => handleFormModal(record)}
                            icon={<Edit3 size={16} />}
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
            <AppleIdControls
                searchAppleId={searchAppleId}
                setSearchAppleId={setSearchAppleId}
                onAddClick={() => handleFormModal(null)}
            />
            <Table
                dataSource={accountData}
                rowKey="_id"
                columns={clolumns}
                loading={loadingAppleId}
                pagination={{
                    current: pageAppleId,
                    total: totalItemsAppleId,
                    pageSizeOptions: ["10", "20", "30", "50", "100"],
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                        setPageAppleId(page);
                        setLimitAppleId(pageSize);
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
            <AppleIdFormModal
                isModalOpen={isModalOpenForm}
                setIsModalOpen={setIsModalOpenForm}
                data={dataForm}
                addAppleIdAccount={addAppleIdAccount}
            />
        </Card>
    );
}
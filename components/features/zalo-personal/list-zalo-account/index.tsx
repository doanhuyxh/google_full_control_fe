"use client"

import { useZaloPersonalAccount } from "@/libs/hooks/users/zaloPersonalAccountHook";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import ZaloPersonalData from "@/libs/intefaces/zaloPersonalData";
import { useState } from "react";
import { Button, Image, Table, Tooltip } from "antd";
import ZaloPersonalAccountControls from "./ZaloAccountControls";
import useDynamicAntdTableScrollHeight from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import FormZaloAccount from "./formZaloAccount";
import { DeleteFilled, EditOutlined } from "@ant-design/icons";
import { deleteZaloPersonalAccount } from "@/libs/api-client/zalo-personal.api";
import FormLoginQr from "./formLoginQr";


export default function ZaloPersonalListAccountComponent() {
    const { accountData,
        totalItemsZaloPersonal,
        pageZaloPersonal,
        setPageZaloPersonal,
        limitZaloPersonal,
        setLimitZaloPersonal,
        searchZaloPersonal,
        setSearchZaloPersonal,
        removeZaloPersonalAccountById,
        addZaloPersonalAccount,
        updateZaloPersonalAccount,
        loadingZaloPersonal
    } = useZaloPersonalAccount();
    const { notification } = useAntdApp();

    const [isModalOpenForm, setIsModalOpenForm] = useState(false);
    const [dataForm, setDataForm] = useState<ZaloPersonalData | null>(null);
    const [isModalOpenLoginQr, setIsModalOpenLoginQr] = useState(false);
    const [selectedZaloId, setSelectedZaloId] = useState<string | null>(null);

    const handleFormModal = (data: ZaloPersonalData | null) => {
        setIsModalOpenForm(true);
        setDataForm(data);
    }

    const handleDeleteAccount = async (id: string) => {
        const response = await deleteZaloPersonalAccount(id);
        if (!response.status) {
            notification.error({
                message: "Error",
                description: response.message || "An error occurred while deleting the Zalo Personal account.",
            });
            return;
        }
        removeZaloPersonalAccountById(id);
        notification.success({
            message: "Success",
            description: "Zalo Personal account has been deleted successfully.",
        });
    }

    const clolumns = [
        { title: "STT", key: "stt", render: (_: any, __: any, index: number) => (index + 1 + (pageZaloPersonal - 1) * limitZaloPersonal), width: 80 },
        { title: 'avatar', dataIndex: 'avatar', key: 'avatar', render: (avatar: string) => (<Image src={avatar || 'https://adminlte.io/themes/v3/dist/img/user2-160x160.jpg'} sizes="8" alt="avatar" className="w-10 h-10 rounded-full" />), width: 120 },
        { title: 'Họ tên', dataIndex: 'display_name', key: 'display_name', width: 250 },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 150 },
        { title: 'Password', dataIndex: 'password', key: 'password', width: 250 },
        {
            title: 'Actions', key: 'actions', render: (_: any, record: ZaloPersonalData) => (
                <div className="flex gap-2 justify-end">                
                    <Tooltip title="Login via QR Code">
                        <Button
                            onClick={() => {
                                setSelectedZaloId(record._id);
                                setIsModalOpenLoginQr(true);
                            }}
                            type="primary"
                        >
                        Login QR    
                        </Button>
                    </Tooltip>

                    <Button
                        icon={<EditOutlined />}
                        className="bg-yellow-500!"
                        onClick={() => handleFormModal(record)} />
                    <Button
                        danger
                        onClick={() => handleDeleteAccount(record._id)}
                        icon={<DeleteFilled />} />

                </div>
            )
        },
    ]

    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
            <ZaloPersonalAccountControls searchZaloPersonal={searchZaloPersonal} setSearchZaloPersonal={setSearchZaloPersonal} onAddClick={() => handleFormModal(null)} />
            <Table
                columns={clolumns}
                dataSource={accountData}
                loading={loadingZaloPersonal}
                rowKey={(record) => record._id}
                pagination={{
                    current: pageZaloPersonal,
                    pageSize: limitZaloPersonal,
                    total: totalItemsZaloPersonal,
                    onChange: (page, pageSize) => {
                        setPageZaloPersonal(page);
                        setLimitZaloPersonal(pageSize);
                    },
                    showTotal(total, range) {
                        return `Hiển thị ${range[0]} - ${range[1]} của ${total} tài khoản`;
                    }
                }}
                scroll={{
                    x: "100%",
                    y: useDynamicAntdTableScrollHeight()
                }}
            />
            <FormZaloAccount
                isShowModal={isModalOpenForm}
                onCloseModal={() => setIsModalOpenForm(false)}
                dataForm={dataForm}
                handleAddSuccess={(newAccount) => {
                    addZaloPersonalAccount(newAccount);
                }}
                handleUpdateSuccess={(updatedAccount) => {
                    updateZaloPersonalAccount(updatedAccount);
                }}
            />
            <FormLoginQr isShowModal={isModalOpenLoginQr} onCloseModal={() => setIsModalOpenLoginQr(false)} zaloId={selectedZaloId} />
        </div>
    );
}
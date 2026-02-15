"use client"

import { useZaloPersonalAccount } from "@/libs/hooks/users/zaloPersonalAccountHook";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import ZaloPersonalData from "@/libs/intefaces/zaloPersonal";
import { useState } from "react";
import { Button, Card, Image, Table, Tooltip } from "antd";
import ZaloPersonalAccountControls from "./ZaloAccountControls";
import useDynamicAntdTableScrollHeight from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import FormZaloAccount from "./formZaloAccount";
import { DeleteFilled, EditOutlined } from "@ant-design/icons";
import { deleteZaloPersonalAccount, getLoginInfoAccZalo, loginZaloPersonalViaCookie } from "@/libs/network/zalo-personal.api";
import FormLoginQr from "./formLoginQr";
import { Cookie } from "lucide-react";
import { useRouter } from "next/navigation";
import { ZaloLoginInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import useLocalStorage from "@/libs/hooks/useLocalStorage";


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
    const navigation = useRouter();

    const [isModalOpenForm, setIsModalOpenForm] = useState(false);
    const [dataForm, setDataForm] = useState<ZaloPersonalData | null>(null);
    const [isModalOpenLoginQr, setIsModalOpenLoginQr] = useState(false);
    const [selectedZaloId, setSelectedZaloId] = useState<string | null>(null);
    const [_, setZaloInfoDetail] = useLocalStorage<ZaloLoginInfo | null>("zaloInfoDetail", null);

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

    const handleLoginViaCookie = async (id: string) => {
        const response = await loginZaloPersonalViaCookie(id);
        if (!response.status) {
            notification.error({
                message: "Error",
                description: response.message || "An error occurred while logging in via cookie.",
            });
            return;
        }
        notification.success({
            message: "Success",
            description: "Login via cookie initiated successfully.",
        });
    }

    const handleDetailAccount = async (id: string) => {
        const response = await getLoginInfoAccZalo(id);
        if (!response.status) {
            notification.error({
                message: "Error",
                description: response.message || "An error occurred while fetching account details.",
            });
            return;
        }
        setZaloInfoDetail(response.data.data);
        navigation.push(`/accounts/zalo-personal/${id}?tab=groups`);

    }

    const clolumns = [
        {
            title: "STT", key: "stt", render: (_: any, __: any, index: number) => (index + 1 + (pageZaloPersonal - 1) * limitZaloPersonal), width: 80
        },
        {
            title: 'avatar', dataIndex: 'avatar', key: 'avatar', render: (avatar: string) => (<Image src={avatar || 'https://adminlte.io/themes/v3/dist/img/user2-100x100.jpg'} sizes="20" alt="avatar" className="w-10 h-10 rounded-full" />), width: 120
        },
        {
            title: 'Họ tên', dataIndex: 'display_name', key: 'display_name', width: 250
        },
        {
            title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 150
        },
        {
            title: 'Mật khẩu', dataIndex: 'password', key: 'password', width: 250,
        },
        {
            title: 'Trạng thái', dataIndex: 'isLogin', key: 'isLogin', width: 150, render: (isLogin: boolean) => {
                return isLogin ? <span className="text-green-500 font-semibold">Đã đăng nhập</span> : <span className="text-red-500 font-semibold">Chưa đăng nhập</span>
            }
        },
        {
            title: 'Hành động', key: 'actions', render: (_: any, record: ZaloPersonalData) => (
                <div className="flex gap-2 justify-end flex-wrap">
                    <Tooltip title="Lấy thông tin tài khoản">
                        <Button
                            disabled={record.isLogin === false}
                            type="link"
                            onClick={() => handleDetailAccount(record._id)}
                        >
                            Thông tin
                        </Button>
                    </Tooltip>
                    <Tooltip title="Đăng nhập qua Cookie">
                        <Button
                            disabled={record.imei === "" || record.imei === null}
                            onClick={handleLoginViaCookie.bind(null, record._id)}
                            type="primary"
                        >
                            <Cookie />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Đăng nhập qua QR Code">
                        <Button
                            onClick={() => {
                                setSelectedZaloId(record._id);
                                setIsModalOpenLoginQr(true);
                            }}
                            type="primary"
                        >
                            QR
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
        <Card className="w-full p-6 rounded-lg border-2 border-gray-200 shadow-sm">
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
        </Card>
    );
}
"use client";
import { useTelegramAccount } from "@/libs/hooks/users/telegramAccountHook";
import { useState } from "react";
import TelegramControl from "./TelegramControl";
import { Button, Card, Table, Tooltip } from "antd";
import useDynamicAntdTableScrollHeight from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import TelegramFormModal from "./TelegramFormModal";
import BotFormModal from "./BotFormModal"
import { TelegramAccountData } from "@/libs/intefaces/telegramData";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { deleteTelegramAccount } from "@/libs/network/telegram.api";
import { PersonStanding } from "lucide-react";
import ListBotModal from "./ListBotModal";


export default function TelegramComponent() {
    const { notification, modal } = useAntdApp()
    const { listTelegramAccount, loadingTele, pageTele, setPageTele, limitTele, setLimitTele, searchTele, setSearchTele, totalItemsTele, removeTelegramAccountById, addTelegramAccount, updateTelegramAccount } = useTelegramAccount();
    const [formDataTelegram, setFormDataTelegram] = useState<{ isShowModal: boolean, teleId: string }>({
        isShowModal: false, teleId: ''
    })

    const [formModalAddBot, setFormModalAddBot] = useState<{ isShowModal: boolean, telegramId: string }>({
        isShowModal: false,
        telegramId: ""
    })


    const [formModalListBot, setFormModalListBot] = useState<{ isShowModal: boolean, telegramId: string }>({
        isShowModal: false,
        telegramId: ""
    })




    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_: any, __: any, index: number) => (pageTele - 1) * limitTele + index + 1,
            width: 60,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tài khoản',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Chat ID',
            dataIndex: 'apiId',
            key: 'apiId',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: "email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Mã 2FA",
            dataIndex: "f2a",
            key: "f2a",
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: any, record: TelegramAccountData) => (
                <div className="flex gap-2 flex-wrap">

                    <Tooltip title='Thêm bot'>
                        <Button
                            onClick={() => setFormModalAddBot({
                                isShowModal: true,
                                telegramId: record._id
                            })}
                            icon={<PlusOutlined />} />
                    </Tooltip>

                    <Tooltip title='Danh sách bot'>
                        <Button
                            onClick={() => setFormModalListBot({
                                isShowModal: true,
                                telegramId: record._id
                            })}
                            icon={<PersonStanding />} />
                    </Tooltip>

                    <Tooltip title="Cập nhật tài khoản">
                        <Button
                            onClick={() => setFormDataTelegram({ isShowModal: true, teleId: record._id })}
                            type="primary"
                            icon={<EditOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa tài khoản">
                        <Button
                            onClick={() => handleDeleteTelegramAccount(record._id)}
                            danger
                        >
                            Xóa
                        </Button>
                    </Tooltip>
                </div>
            )
        }
    ]

    const handleFormClose = () => {
        setFormDataTelegram({ isShowModal: false, teleId: '' });
    }

    const handleAddTelegramAccount = () => {
        setFormDataTelegram({ isShowModal: true, teleId: '' });
    }

    const handleDeleteTelegramAccount = (id: string) => {
        modal.confirm({
            title: 'Xác nhận xóa tài khoản Telegram',
            content: 'Bạn có chắc chắn muốn xóa tài khoản Telegram này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await deleteTelegramAccount(id);
                if (response.status) {
                    removeTelegramAccountById(id);
                    notification.success({
                        message: 'Xóa tài khoản Telegram thành công',
                    });
                } else {
                    notification.error({
                        message: 'Xóa tài khoản Telegram thất bại',
                        description: response.message || 'Không thể kết nối đến máy chủ',
                    });
                }
            },
        });
    }

    return (
        <Card className="flex flex-col flex-1 gap-4 p-4 m-2 rounded-2xl shadow-md">
            <h2 className="text-center">Quản lý Telegram</h2>
            <TelegramControl
                searchTelegram={searchTele}
                setSearchTelegram={setSearchTele}
                onAddClick={handleAddTelegramAccount}
            />
            <div className="w-full">
                <Table
                    dataSource={listTelegramAccount}
                    loading={loadingTele}
                    rowKey={(record) => record._id}
                    pagination={{
                        current: pageTele,
                        pageSize: limitTele,
                        total: totalItemsTele,
                        onChange: (page, pageSize) => {
                            setPageTele(page);
                            setLimitTele(pageSize || limitTele);
                        },
                        showTotal(total, range) {
                            return `Hiển thị từ ${range[0]} đến ${range[1]} của ${total} kết quả`;
                        },
                    }}
                    scroll={{
                        x: "max-content",
                        y: useDynamicAntdTableScrollHeight()
                    }}
                    columns={columns}
                />
            </div>

            <TelegramFormModal
                isVisible={formDataTelegram.isShowModal}
                teleId={formDataTelegram.teleId}
                onClose={handleFormClose}
                onAddData={addTelegramAccount}
                onUpdateData={updateTelegramAccount}
            />

            <BotFormModal
                isShowModal={formModalAddBot.isShowModal}
                telegramId={formModalAddBot.telegramId}
                onClose={() => {
                    setFormModalAddBot({
                        isShowModal: false,
                        telegramId: ""
                    })
                }}
            />

            <ListBotModal
                isShowModal={formModalListBot.isShowModal}
                telegramId={formModalListBot.telegramId}
                onClose={() => {
                    setFormModalListBot({
                        isShowModal: false,
                        telegramId: ""
                    })
                }}
            />

        </Card>
    );
}
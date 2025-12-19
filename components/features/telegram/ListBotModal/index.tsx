import { Button, Input, Modal, Table } from "antd";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getBotsByTelegramAccount, deleteBot, updateBot } from "@/libs/api-client/telegram.api";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { useCommon } from "@/libs/hooks/useCommon";
import debounce from "lodash/debounce";
import { CopyFilled, DeleteFilled } from "@ant-design/icons";

interface ListBotModalProp {
    telegramId: string;
    isShowModal: boolean;
    onClose: () => void;
}

export default function ListBotModal({ isShowModal, onClose, telegramId }: ListBotModalProp) {
    const { notification } = useAntdApp();
    const [loading, setLoading] = useState(false);
    const [botList, setBotList] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const debouncedSearch = useDebounce(search, 500);
    const { copiedToClipboard } = useCommon();

    const fetchBotList = async () => {
        setLoading(true);
        try {
            const response = await getBotsByTelegramAccount(telegramId, page, limit, debouncedSearch);
            setLoading(false);
            if (!response.status) {
                notification.error({
                    message: "Lỗi khi tải danh sách bot",
                    description: response.message || "Đã xảy ra lỗi không xác định.",
                });
                return;
            }
            setBotList(response.data.items);
            setTotalItems(response.data.pagination.total);
        } catch {
            setLoading(false);
            notification.error({
                message: "Lỗi khi tải danh sách bot",
                description: "Đã xảy ra lỗi không xác định.",
            });
        }
    };

    const apiUpdateBot = useCallback(async (botId: string, updatedData: any) => {
        const response = await updateBot(
            telegramId,
            botId,
            updatedData.botToken,
            updatedData.botUsername,
            updatedData.note
        );
        if (!response.status) {
            notification.error({
                message: "Lỗi khi cập nhật bot",
                description: response.message || "Đã xảy ra lỗi không xác định.",
            });
        }else{
            notification.success({
                message: "Cập nhật bot thành công",
            });
        }
    }, [telegramId, notification]);
    const debouncedApiUpdate = useMemo(() => debounce(apiUpdateBot, 800), [apiUpdateBot]);

    const handleUpdateBot = (botId: string, key: string, value: any) => {
        let updatedRecord: any = null;
        setBotList(prev => prev.map(bot => {
            if (bot._id === botId) {
                updatedRecord = { ...bot, [key]: value };
                return updatedRecord;
            }
            return bot;
        }));        
        if (updatedRecord) {
            debouncedApiUpdate(botId, updatedRecord);
        }
    };

    const handleDeleteBot = async (botId: string) => {
        const response = await deleteBot(telegramId, botId);
        if (response.status) {
            notification.success({
                message: "Xóa bot thành công",
            });
            setBotList(prev => prev.filter(bot => bot._id !== botId));
        } else {
            notification.error({
                message: "Lỗi khi xóa bot",
                description: response.message || "Đã xảy ra lỗi không xác định.",
            });
        }
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
            width: 70,
        },
        {
            title: 'Username',
            dataIndex: 'botUsername',
            key: 'botUsername',
            width: 250,
            render: (text: string, record: any) => (
                <Input
                    value={text}
                    onChange={(e) => handleUpdateBot(record._id, 'botUsername', e.target.value)}
                />
            )
        },
        {
            title: 'Token',
            dataIndex: 'botToken',
            key: 'botToken',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-2">
                    <Input
                        value={text}
                        onChange={(e) => handleUpdateBot(record._id, 'botToken', e.target.value)}
                    />
                    <Button
                        icon={<CopyFilled />}
                        onClick={() => copiedToClipboard(text)}
                    />
                </div>
            ),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            render: (text: string, record: any) => (
                <Input
                    value={text}
                    onChange={(e) => handleUpdateBot(record._id, 'note', e.target.value)}
                />
            ),
            width: 350,
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleDeleteBot(record._id)}
                        danger
                        icon={<DeleteFilled />}
                    />
                </div>
            ),
            width: 80,
        }
    ]

    useEffect(() => {
        if (isShowModal) {
            fetchBotList();
        }
    }, [isShowModal, page, debouncedSearch, limit]);

    return (
        <Modal
            title="Danh sách Bot"
            className="text-center"
            open={isShowModal}
            onOk={() => { }}
            width={1200}
            onCancel={onClose}
            footer={null}
        >
            <Table
                dataSource={botList}
                loading={loading}
                rowKey={(record) => record._id}
                pagination={{
                    current: page,
                    pageSize: limit,
                    total: totalItems,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setLimit(pageSize || limit);
                    },
                    showTotal(total, range) {
                        return `Hiển thị từ ${range[0]} đến ${range[1]} của ${total} kết quả`;
                    },
                }}
                scroll={{
                    x: "100%",
                    y: 1000
                }}
                columns={columns}
            />
        </Modal>

    )
}
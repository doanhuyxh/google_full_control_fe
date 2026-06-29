import { Button, Input, Modal, Table } from "antd";
import { useMemo, useCallback } from "react";
import { useCommon } from "@/libs/hooks/useCommon";
import debounce from "lodash/debounce";
import { CopyFilled, DeleteFilled, SendOutlined } from "@ant-design/icons";
import { useTelegramBot } from "@/libs/hooks/users/telegramBotHook";

interface ListBotModalProp {
    telegramId: string;
    isShowModal: boolean;
    onClose: () => void;
}

export default function ListBotModal({ isShowModal, onClose, telegramId }: ListBotModalProp) {
    const { copiedToClipboard } = useCommon();
    const {
        botList,
        loading,
        page,
        setPage,
        limit,
        setLimit,
        totalItems,
        updateBot,
        deleteBot,
        testBotConnection,
        isTestingBot,
        isDeletingBot,
    } = useTelegramBot(telegramId, isShowModal);

    const apiUpdateBot = useCallback(async (botId: string, updatedData: { botToken: string; botUsername: string; note: string }) => {
        await updateBot({
            botId,
            botToken: updatedData.botToken,
            botUsername: updatedData.botUsername,
            note: updatedData.note,
        });
    }, [updateBot]);

    const debouncedApiUpdate = useMemo(() => debounce(apiUpdateBot, 800), [apiUpdateBot]);

    const handleUpdateBot = (botId: string, key: string, value: string) => {
        const currentBot = botList.find((bot) => bot._id === botId);
        if (!currentBot) return;
        const updatedRecord = { ...currentBot, [key]: value };
        debouncedApiUpdate(botId, {
            botToken: updatedRecord.botToken,
            botUsername: updatedRecord.botUsername,
            note: updatedRecord.note,
        });
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_: unknown, __: unknown, index: number) => (page - 1) * limit + index + 1,
            width: 70,
        },
        {
            title: 'Username',
            dataIndex: 'botUsername',
            key: 'botUsername',
            width: 250,
            render: (text: string, record: { _id: string }) => (
                <Input
                    defaultValue={text}
                    onChange={(e) => handleUpdateBot(record._id, 'botUsername', e.target.value)}
                />
            )
        },
        {
            title: 'Token',
            dataIndex: 'botToken',
            key: 'botToken',
            render: (text: string, record: { _id: string }) => (
                <div className="flex items-center gap-2">
                    <Input
                        defaultValue={text}
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
            render: (text: string, record: { _id: string }) => (
                <Input
                    defaultValue={text}
                    onChange={(e) => handleUpdateBot(record._id, 'note', e.target.value)}
                />
            ),
            width: 350,
        },
        {
            title: '',
            key: 'action',
            render: (_: unknown, record: { _id: string }) => (
                <div className="flex gap-2">
                    <Button
                        loading={isTestingBot}
                        onClick={() => testBotConnection(record._id)}
                        type="primary"
                        icon={<SendOutlined />}
                    />
                    <Button
                        onClick={() => deleteBot(record._id)}
                        danger
                        loading={isDeletingBot}
                        icon={<DeleteFilled />}
                    />
                </div>
            ),
            width: 120,
        }
    ];

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
                    onChange: (newPage, pageSize) => {
                        setPage(newPage);
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
    );
}

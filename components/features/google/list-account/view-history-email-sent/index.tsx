
import { Button, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { getHistorySentEmail } from "@/libs/api-client/google.api";


interface ViewEmailSentProps {
    isShowModal: boolean;
    onCloseModal: () => void;
    googleAccountId: string;
    emailName?: string;
}

export default function ViewHistoryEmailSent({ isShowModal, onCloseModal, googleAccountId, emailName }: ViewEmailSentProps) {
    const [emailHistory, setEmailHistory] = useState<any | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const { notification } = useAntdApp();

    const fetchEmailHistory = async (googleAccountId: string, page: number, limit: number) => {
        try {
            const response = await getHistorySentEmail(googleAccountId, page, limit);
            if (response.status) {
                setEmailHistory(response.data);
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'An error occurred while fetching email history.',
                });
            }
        } catch (error: any) {
            notification.error({
                message: 'Error',
                description: error.message || 'An unexpected error occurred while fetching email history.',
            });
        }
    }

    const columns = [
        { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_: any, __: any, index: number) => (index + 1 + (page - 1) * limit), width: 80 },
        { title: 'Email nhận', dataIndex: 'toEmail', key: 'toEmail', width: 250 },
        { title: 'Tiêu đề', dataIndex: 'subject', key: 'subject', width: 250 },
        {
            title: 'Trạng thái', key: 'status', width: 250,
            render: (data: any) => (
                <div className="flex gap-2 flex-col">
                    {data.status === 'sent' && (
                        <span className="text-blue-600 font-semibold">Đã gửi thành công</span>
                    )}
                    {data.status === 'failed' && (
                        <span className="text-red-600 font-semibold">Gửi thất bại</span>
                    )}
                    {data.status === 'read' && (
                        <p className="text-green-600 font-semibold">
                            Đã mở lúc: {new Date(data.readAt).toLocaleString()}
                        </p>
                    )}
                </div>
            )
        },
        { title: 'Thông tin trả về', dataIndex: 'messageResponse', key: 'messageResponse', width: 300 },
        { title: 'Thời gian gửi', dataIndex: 'createdAt', key: 'createdAt', width: 230, render: (createdAt: string) => (new Date(createdAt).toLocaleString()) },
    ]

    useEffect(() => {
        if (isShowModal) {
            fetchEmailHistory(googleAccountId, page, limit);
        }
    }, [isShowModal, googleAccountId, page, limit]);

    return (
        <Modal
            title={`Lịch sử email đã gửi - ${emailName || ''}`}
            open={isShowModal}
            onCancel={onCloseModal}
            width={1600}
            footer={[
                <Button key="cancel" onClick={onCloseModal} type="primary">
                    Đóng
                </Button>
            ]}
        >
            <Table
                dataSource={emailHistory ? emailHistory.items : []}
                rowKey={(record) => record.id}
                columns={columns}
                pagination={{
                    current: page,
                    pageSize: limit,
                    total: emailHistory ? emailHistory.pagination.total : 0,
                    onChange: (newPage, newLimit) => {
                        setPage(newPage);
                        setLimit(newLimit);
                    },
                    onShowSizeChange: (_current, size) => {
                        setLimit(size);
                    }
                }}
                scroll={{
                    x: "max-content",
                    y: 800,
                }}
            />
        </Modal>
    );
}

import { Button, Modal, Table, Tag } from "antd";
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
            title: 'Trạng thái', key: 'status', width: 280,
            render: (data: any) => {
                const status = (data?.status || '').toLowerCase();
                const readAt = data?.readAt ? new Date(data.readAt).toLocaleString() : null;
                const message = data?.messageResponse;
                const statusMap: Record<string, { label: string; color: string }> = {
                    pending: { label: 'Đang xử lý', color: 'blue' },
                    queued: { label: 'Đã xếp hàng', color: 'geekblue' },
                    sent: { label: 'Đã gửi thành công', color: 'cyan' },
                    delivered: { label: 'Đã gửi tới hộp thư', color: 'green' },
                    received: { label: 'Đã nhận', color: 'orange' },
                    read: { label: 'Đã mở', color: 'green' },
                    failed: { label: 'Gửi thất bại', color: 'red' },
                };
                const current = statusMap[status] || { label: 'Không rõ', color: 'default' };
                return (
                    <div className="flex flex-col gap-1">
                        <Tag color={current.color}>{current.label}</Tag>
                        {status === 'read' && (
                            <span className="text-green-700">{readAt ? `Đã mở lúc: ${readAt}` : 'Đã mở (không rõ thời gian)'}</span>
                        )}
                        {status === 'failed' && message && (
                            <span className="text-red-700">Lý do: {message}</span>
                        )}
                    </div>
                );
            }
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
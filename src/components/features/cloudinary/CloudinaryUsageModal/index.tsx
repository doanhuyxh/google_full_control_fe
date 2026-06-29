import { CloudinaryData } from '@/libs/interfaces/cloudinaryData';
import { Modal, Descriptions, Progress, Tag, Space, Typography } from 'antd';
const { Text, Title } = Typography;


interface UsageProps {
    isModalOpen: boolean;
    handleCancel: () => void;
    data: any | null;
    account: CloudinaryData | null;
}

const CloudinaryUsageModal = ({ isModalOpen, handleCancel, data, account }: UsageProps) => {
    if (!data) return null;
    const {
        plan,
        last_updated,
        credits,
        resources,
        rate_limit_remaining
    } = data;
    const storageUsageMB = (data.storage.usage / (1024 * 1024)).toFixed(2);
    const storageLimitMB = (data.media_limits.image_max_size_bytes / (1024 * 1024)).toFixed(2);
    const rateLimitResetDate = new Date(data.rate_limit_reset_at).toLocaleString();

    return (
        <Modal
            title={<Title className='text-center' level={4}>📊 Báo cáo Hạn mức Cloudinary - {account?.accountMail}</Title>}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Descriptions
                    title="Tổng quan Tài khoản"
                    bordered
                    size="small"
                    column={{ xs: 1, sm: 2, md: 3 }}
                >
                    <Descriptions.Item label="Gói Dịch vụ">
                        <Tag color="blue">{plan}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Assets (Tài nguyên)">
                        <Text strong>{resources}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Cập nhật gần nhất">{last_updated}</Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 20 }}>
                    <Title level={5}>Tín dụng (Credits) đã sử dụng</Title>
                    <Text type="secondary">Tổng hạn mức: {credits.limit} Credits</Text>
                    <Progress
                        percent={credits.used_percent}
                        status={credits.used_percent > 80 ? "exception" : "active"}
                        strokeColor={credits.used_percent > 80 ? "#ff4d4f" : "#52c41a"}
                        format={() => `${credits.usage} / ${credits.limit} Credits (${credits.used_percent}%)`}
                    />
                </div>
                <Descriptions
                    title="Chi tiết Sử dụng"
                    bordered
                    size="small"
                    column={{ xs: 1, sm: 2, md: 3 }}
                >
                    <Descriptions.Item label="Lưu trữ (Storage)">
                        <Text>{storageUsageMB} MB</Text>
                        <Text type="secondary"> (Max asset: {storageLimitMB} MB)</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Băng thông (Bandwidth)">
                        <Text>{data.bandwidth.usage} MB</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Chuyển đổi (Transformations)">
                        <Text>{data.transformations.usage}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Hạn mức API còn lại">
                        <Text strong>{rate_limit_remaining} / {data.rate_limit_allowed}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Reset Rate Limit">
                        <Text>{rateLimitResetDate}</Text>
                    </Descriptions.Item>
                </Descriptions>

            </Space>
        </Modal>
    );
};

export default CloudinaryUsageModal;
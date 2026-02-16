import { useCommon } from "@/libs/hooks/useCommon";
import { ProfilesMemberGroup } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { formatTimestampToLocal } from "@/libs/utils/timeUtils";
import { Avatar, Button, Card, Space, Tag, Typography } from "antd";

const { Text } = Typography;

interface MemberItemGroupProps {
    item: ProfilesMemberGroup;
}

const getAccountStatusTag = (status: number) => {
    if (status === 1) return <Tag color="green">Đang hoạt động</Tag>;
    if (status === 0) return <Tag color="orange">Không hoạt động</Tag>;
    return <Tag color="default">Trạng thái: {status}</Tag>;
};

export default function MemberItemGroup({ item }: MemberItemGroupProps) {
    const { copiedToClipboard } = useCommon();
    return (
        <Card className="w-full flex flex-col">
            <div className="flex items-start gap-4">
                <Avatar src={item.avatar} size={64} />
                <div className="flex-1">
                    <p className="mb-1 text-base font-semibold">{item.displayName || "Chưa có tên"}</p>
                    <Text type="secondary">@{item.zaloName || "unknown"}</Text>
                </div>
            </div>

            <Space direction="vertical" size={4} className="mt-4 w-full">
                {getAccountStatusTag(item.accountStatus)}
                <Text>ID:
                    {" "}
                    <span className="cursor-copy" onClick={() => copiedToClipboard(item.id)}>{item.id}</span>
                </Text>
                <Text className="line-clamp-1 truncate">
                    Global ID: {" "}
                    <span className="cursor-copy" onClick={() => copiedToClipboard(item.globalId)}>{item.globalId}</span>
                </Text>
                <Text>Loại tài khoản: {item.type}</Text>
                <Text>Cập nhật cuối: {formatTimestampToLocal(item.lastUpdateTime)}</Text>
            </Space>

            <div className="mt-5 flex gap-2">
                <Button type="primary" className="flex-1">
                    Gửi kết bạn
                </Button>
                <Button className="flex-1">
                    Nhắn tin
                </Button>
            </div>
        </Card>
    )
}
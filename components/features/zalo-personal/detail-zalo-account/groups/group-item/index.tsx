import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { ProfilesMemberGroup, ZaloGroupInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { getMemberInZaloGroup } from "@/libs/network/zalo-personal.api";
import { getAllValueFromObject, merchObjectToObject } from "@/libs/utils/JsUtils";
import { formatTimestampToLocal } from "@/libs/utils/timeUtils";
import { Avatar, Button, Modal, Tag, Typography } from "antd";
import { useState } from "react";
import MemberItemGroup from "./member-item-group";
import { useCommon } from "@/libs/hooks/useCommon";

const { Text } = Typography;

interface GroupItemProps {
    item: ZaloGroupInfo;
    accountId: string;
}

export default function GroupItem({ item, accountId }: GroupItemProps) {
    const { notification } = useAntdApp();
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [isShowMembers, setIsShowMembers] = useState(false);
    const [members, setMembers] = useState<ProfilesMemberGroup[]>([]);
    const { copiedToClipboard } = useCommon();

    const privacyLabel = item.visibility === 1 ? "Riêng tư" : "Công khai";

    const handleShowMembers = async () => {
        setIsShowMembers(true);
        setLoadingMembers(true);

        try {
            const memberIds = getAllValueFromObject(item.memVerList || {}) || [];
            if (memberIds.length === 0) {
                setMembers([]);
                notification.warning({
                    message: "Không có thành viên",
                    description: "Nhóm này hiện không có thành viên nào hoặc đã có lỗi khi lấy thông tin thành viên.",
                });
                return;
            }

            const profilesMap: Record<string, ProfilesMemberGroup> = {};

            for (let i = 0; i < memberIds.length; i += 10) {
                const chunkMemberIds = memberIds.slice(i, i + 10);
                const response = await getMemberInZaloGroup(accountId, item.groupId, chunkMemberIds);

                if (!response.status) {
                    notification.error({
                        message: "Lỗi",
                        description: response.message || "Đã có lỗi xảy ra khi lấy thông tin thành viên nhóm.",
                    });
                    return;
                }

                if (response.data.error_code != 0) {
                    notification.error({
                        message: "Lỗi",
                        description: response.data.error_message || "Đã có lỗi xảy ra khi lấy thông tin thành viên nhóm.",
                    });
                    return;
                }

                if (response.data.data?.profiles) {
                    merchObjectToObject(profilesMap, response.data.data.profiles);
                }
            }

            const nextMembers = getAllValueFromObject(profilesMap) || [];
            if (nextMembers.length === 0) {
                notification.warning({
                    message: "Không có thành viên",
                    description: "Nhóm này hiện không có thành viên nào hoặc đã có lỗi khi lấy thông tin thành viên.",
                });
            }

            setMembers(nextMembers);
        } finally {
            setLoadingMembers(false);
        }
    };

    return (
        <>
            <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-row gap-4">
                    <div className="flex items-start gap-3">
                        <Avatar src={item.fullAvt || item.avt || "ttps://adminlte.io/themes/v3/dist/img/user2-100x100.jpg"} size={56} />
                        <div className="space-y-1">
                            <p className="text-base font-semibold">{item.name || "Nhóm chưa đặt tên"}</p>
                            <p className="text-sm text-gray-500">
                                ID:
                                <span
                                    onClick={() => copiedToClipboard(item.groupId)}
                                    className="font-mono cursor-copy">{item.groupId}</span>
                            </p>
                            <Text type="secondary">{item.desc || "Không có mô tả"}</Text>
                            <div className="flex flex-wrap gap-2">
                                <Tag color="blue">{privacyLabel}</Tag>
                                {item.e2ee === 1 ? <Tag color="green">Mã hoá đầu cuối</Tag> : null}
                            </div>
                            <p className="text-sm">
                                <span className="font-medium">Ngày tạo:</span> {formatTimestampToLocal(item.createdTime)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <Button
                        loading={loadingMembers}
                        type="primary"
                        onClick={handleShowMembers}>
                        Xem thành viên
                    </Button>
                </div>
            </div>
            <Modal open={isShowMembers}
                onCancel={() => setIsShowMembers(false)}
                title={`Thành viên nhóm ${item.name}`}
                style={{ top: 20 }}
                maskClosable={false}
                width={1600}
                loading={loadingMembers}
                footer={
                    <div className="w-full flex justify-end">
                        <Button onClick={() => setIsShowMembers(false)}>Đóng</Button>
                    </div>
                }
            >
                <div className="grid w-full max-h-[80vh] grid-cols-1 gap-4 overflow-auto md:grid-cols-2 xl:grid-cols-5">
                    {members.map((member) => (
                        <MemberItemGroup key={member.id} item={member} />
                    ))}
                </div>
            </Modal>
        </>
    );
}
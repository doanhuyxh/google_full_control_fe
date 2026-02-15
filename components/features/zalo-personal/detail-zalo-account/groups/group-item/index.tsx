import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { ProfilesMemberGroup, ZaloGroupInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { getMemberInZaloGroup } from "@/libs/network/zalo-personal.api";
import { getAllValueFromObject, merchObjectToObject } from "@/libs/utils/JsUtils";
import { formatTimestampToLocal } from "@/libs/utils/timeUtils";
import { Button, Modal } from "antd";
import { useState } from "react";
import MemberItemGroup from "./member-item-group";

interface GroupItemProps {
    item: ZaloGroupInfo;
    accountId: string;
}

export default function GroupItem({ item, accountId }: GroupItemProps) {
    const { notification } = useAntdApp();
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [isShowMembers, setIsShowMembers] = useState(false);
    const [members, setMembers] = useState<ProfilesMemberGroup[]>([]);

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
            <div className="flex flex-wrap gap-2">
                <p>Tổng số thành viên: {item.totalMember} / {item.maxMember}</p>
                <div className="flex flex-wrap gap-2">
                    <Button
                        loading={loadingMembers}
                        type="primary"
                        onClick={handleShowMembers}>
                        Xem thành viên
                    </Button>
                </div>
                <p>Ngày tạo: {formatTimestampToLocal(item.createdTime)}</p>
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
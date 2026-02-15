import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { ProfilesMemberGroup, ZaloGroupInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { getMemberInZaloGroup } from "@/libs/network/zalo-personal.api";
import { getAllValueFromObject } from "@/libs/utils/JsUtils";
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
        const memberIds = getAllValueFromObject(item.memVerList || {}) || [];
        const response = await getMemberInZaloGroup(accountId, item.groupId, memberIds);
        setLoadingMembers(false);
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
        if (!response.data.data || !response.data.data.profiles) {
            notification.warning({
                message: "Không có thành viên",
                description: "Nhóm này hiện không có thành viên nào hoặc đã có lỗi khi lấy thông tin thành viên.",
            });
            setMembers([]);
            return;
        }
        setMembers(getAllValueFromObject(response.data.data.profiles) || []);
        setIsShowMembers(true);

    }

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
                width={1600}
                loading={loadingMembers}
                footer={
                    <div className="w-full flex justify-end">
                        <Button onClick={() => setIsShowMembers(false)}>Đóng</Button>
                    </div>
                }
            >
                <div className="w-full max-h-[80vh] overflow-auto">
                    {members.map((member) => (
                        <MemberItemGroup key={member.id} item={member} />
                    ))}
                </div>
            </Modal>
        </>

    )
}
import { ZaloGroupInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { formatTimestampToLocal } from "@/libs/utils/timeUtils";

interface GroupItemProps {
    item: ZaloGroupInfo;
}

export default function GroupItem({ item }: GroupItemProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <p>Tổng số thành viên: {item.totalMember} / {item.maxMember}</p>
            <p>Ngày tạo: {formatTimestampToLocal(item.createdTime)}</p>
        </div>
    )
}
import { ZaloGroupInfo } from "@/libs/intefaces/zaloPersonal/zaloAccData";

interface GroupItemProps {
    item: ZaloGroupInfo;
}

export default function GroupItem({ item }: GroupItemProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <p>Tổng số thành viên: {item.memVerList.length} || {item.totalMember}</p>
            <p>Ngày tạo: {item.createdTime}</p>
        </div>
    )
}
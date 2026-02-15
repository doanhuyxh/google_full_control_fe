import { ProfilesMemberGroup } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { Card } from "antd";

interface MemberItemGroupProps {
    item: ProfilesMemberGroup;
}

export default function MemberItemGroup({ item }: MemberItemGroupProps) {
    return (
        <Card>
            <p>Tên: {item.displayName}</p>
        </Card>
    )
}
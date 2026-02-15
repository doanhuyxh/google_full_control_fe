"use client";

import InfoZaloAccount from "./info/index";
import GroupListZaloAccount from "./groups/index";
import FriendListZaloAccount from "./friends/index";

interface DetailZaloAccountProps {
    id: string;
}

export default function DetailZaloAccount({ id }: DetailZaloAccountProps) {
    const [tab, setTab] = []

    return (
        <div className="space-y-4">
            <InfoZaloAccount id={id} />
            <GroupListZaloAccount id={id} />
            <FriendListZaloAccount id={id} />
        </div>
    );
}
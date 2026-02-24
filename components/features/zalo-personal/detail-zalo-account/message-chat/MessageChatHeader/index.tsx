import { Avatar } from "antd";

interface MessageChatHeaderProps {
    fullName: string;
    avatarUrl: string;
}

export default function MessageChatHeader({ fullName, avatarUrl }: MessageChatHeaderProps) {
    return (
        <header className="pb-4 border-b border-gray-200 flex gap-2 items-center">
            <Avatar src={avatarUrl} alt={fullName} size={40} className="mb-1" />
            <h2 className="text-lg font-semibold text-gray-900">{fullName}</h2>
        </header>
    );
}

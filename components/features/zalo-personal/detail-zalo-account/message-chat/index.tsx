import useLocalStorage from "@/libs/hooks/useLocalStorage";
import useSearchParamsClient from "@/libs/hooks/useSearchParamsClient";
import { ChangedProfiles, ZaloGroupInfo, ZaloThreadType } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { sendMessageToZaloGroup, sendMessageToZaloUser } from "@/libs/network/zalo-personal.api";
import { useAppSelector } from "@/libs/redux/hooks";
import { Avatar } from "antd";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ChatMessage = {
    id: string;
    senderName: string;
    content: string;
    createdAt: string;
    isMe: boolean;
};

interface MessageChatZaloAccountProps {
    accountId: string;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
    {
        id: "m1",
        senderName: "Nguyễn Văn A",
        content: "Chào bạn, bên mình đã nhận được thông tin rồi nhé.",
        createdAt: "09:20",
        isMe: false,
    },
    {
        id: "m2",
        senderName: "Bạn",
        content: "Dạ cảm ơn, mình muốn hỏi thêm về gói dịch vụ.",
        createdAt: "09:22",
        isMe: true,
    },
    {
        id: "m3",
        senderName: "Nguyễn Văn A",
        content: "Bạn cứ nhắn câu hỏi, mình hỗ trợ ngay.",
        createdAt: "09:24",
        isMe: false,
    },
];

export default function MessageChatZaloAccount({ accountId }: MessageChatZaloAccountProps) {
    const [threadTypeRaw] = useSearchParamsClient<string>("threadType", "");
    const [threadId] = useSearchParamsClient<string>("threadId", "");
    const [fullName, setFullName] = useState<string>("Vui lòng chọn cuộc trò chuyện");
    const [avatarUrl, setAvatarUrl] = useState<string>("https://static-zmp3.zadn.vn/default_avatar.png");
    const reduxFriends = useAppSelector((state) => state.zaloDetail.friendsByAccount[accountId] || []);
    const reduxGroups = useAppSelector((state) => state.zaloDetail.groupsByAccount[accountId] || []);
    const [cachedFriends] = useLocalStorage<ChangedProfiles[]>(`zalo-personal-friends:${accountId}`, []);
    const [groupDetails] = useLocalStorage<ZaloGroupInfo[]>(`groupDetails_${accountId}`, []);

    const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
    const [draftMessage, setDraftMessage] = useState<string>("");
    const threadType = useMemo(() => Number(threadTypeRaw), [threadTypeRaw]);
    const friendsData = useMemo(() => (reduxFriends.length > 0 ? reduxFriends : cachedFriends), [reduxFriends, cachedFriends]);
    const groupsData = useMemo(() => (reduxGroups.length > 0 ? reduxGroups : groupDetails), [reduxGroups, groupDetails]);

    const handleSendMessage = async (event: FormEvent) => {
        event.preventDefault();

        const trimmedContent = draftMessage.trim();
        if (!trimmedContent) return;

        const now = new Date();
        const createdAt = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        switch (threadType) {
            case ZaloThreadType.USER:
                await sendMessageToZaloUser(accountId, threadId, trimmedContent);
                break;
            case ZaloThreadType.GROUP:
                await sendMessageToZaloGroup(accountId, threadId, trimmedContent);
                break;
            default:
                console.warn("Unknown thread type:", threadType);
                return;
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                id: `${Date.now()}`,
                senderName: "Bạn",
                content: trimmedContent,
                createdAt,
                isMe: true,
            },
        ]);
        setDraftMessage("");
    };

    useEffect(() => {
        if (threadType === ZaloThreadType.USER) {
            const friend = friendsData.find((f) => f.userId === threadId);
            if (friend) {
                setFullName(friend.displayName || friend.zaloName || "Bạn bè");
                setAvatarUrl(friend.avatar || "https://static-zmp3.zadn.vn/default_avatar.png");
            } else {
                setFullName("Bạn bè");
                setAvatarUrl("https://static-zmp3.zadn.vn/default_avatar.png");
            }
            return;
        }
        if (threadType === ZaloThreadType.GROUP) {
            const group = groupsData.find((g) => g.groupId === threadId);
            if (group) {
                setFullName(group.name || "Nhóm");
                setAvatarUrl(group.avt || group.fullAvt || "https://static-zmp3.zadn.vn/default_avatar.png");
            } else {
                setFullName("Nhóm");
                setAvatarUrl("https://static-zmp3.zadn.vn/default_avatar.png");
            }
            return;
        }

        setFullName("Vui lòng chọn cuộc trò chuyện");
        setAvatarUrl("https://static-zmp3.zadn.vn/default_avatar.png");
    }, [threadType, threadId, friendsData, groupsData]);

    return (
        <div className="p-4 h-full min-h-[80vh] flex flex-col bg-white rounded-lg border border-gray-200">
            <header className="pb-4 border-b border-gray-200 flex gap-2 items-center">
                <Avatar src={avatarUrl} alt={fullName} size={40} className="mb-1" />
                <h2 className="text-lg font-semibold text-gray-900">{fullName}</h2>
            </header>

            <div className="flex-1 max-h-[65vh] overflow-y-auto py-4 space-y-3">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[90%] rounded-2xl px-3 py-2 ${message.isMe
                                ? "bg-blue-600 text-white rounded-br-md"
                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                                }`}
                        >
                            {!message.isMe && (
                                <p className="text-xs font-medium mb-1 text-gray-600">{message.senderName}</p>
                            )}
                            <p className="whitespace-pre-wrap wrap-break-word text-sm">{message.content}</p>
                            <p
                                className={`text-[11px] mt-1 ${message.isMe ? "text-blue-100" : "text-gray-500"
                                    }`}
                            >
                                {message.createdAt}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-200">
                <div className="flex items-end gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-white">
                    <textarea
                        value={draftMessage}
                        onChange={(event) => setDraftMessage(event.target.value)}
                        onInput={(event) => {
                            const target = event.currentTarget;
                            target.style.height = "auto";
                            target.style.height = `${Math.min(target.scrollHeight, 140)}px`;
                        }}
                        placeholder="Nhập tin nhắn..."
                        rows={1}
                        className="w-full resize-none max-h-[140px] outline-none text-sm text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!draftMessage.trim()}
                        className="h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Gửi
                    </button>
                </div>
            </form>
        </div>
    )
}
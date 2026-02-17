import useLocalStorage from "@/libs/hooks/useLocalStorage";
import useSearchParamsClient from "@/libs/hooks/useSearchParamsClient";
import { ChangedProfiles, ZaloGroupInfo, ZaloThreadType } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { ZaloMsgTypeEnum } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { getZaloPersonalMessageHistory, sendMessageToZaloGroup, sendMessageToZaloUser } from "@/libs/network/zalo-personal.api";
import { useAppSelector } from "@/libs/redux/hooks";
import { FormEvent, useEffect, useMemo, useState } from "react";
import MessageChatComposer from "./MessageChatComposer";
import MessageChatHeader from "./MessageChatHeader";
import MessageChatList from "./MessageChatList";
import { ChatMessage } from "./types";

interface MessageChatZaloAccountProps {
    accountId: string;
}

const MESSAGE_PAGE = 1;
const MESSAGE_LIMIT = 100;

const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};

export default function MessageChatZaloAccount({ accountId }: MessageChatZaloAccountProps) {
    const [threadTypeRaw] = useSearchParamsClient<string>("threadType", "");
    const [threadId] = useSearchParamsClient<string>("threadId", "");
    const [fullName, setFullName] = useState<string>("Vui lòng chọn cuộc trò chuyện");
    const [avatarUrl, setAvatarUrl] = useState<string>("https://static-zmp3.zadn.vn/default_avatar.png");
    const reduxFriends = useAppSelector((state) => state.zaloDetail.friendsByAccount[accountId] || []);
    const reduxGroups = useAppSelector((state) => state.zaloDetail.groupsByAccount[accountId] || []);
    const [cachedFriends] = useLocalStorage<ChangedProfiles[]>(`zalo-personal-friends:${accountId}`, []);
    const [groupDetails] = useLocalStorage<ZaloGroupInfo[]>(`groupDetails_${accountId}`, []);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draftMessage, setDraftMessage] = useState<string>("");
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
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
                msgType: ZaloMsgTypeEnum.WEBCHAT,
                createdAt,
                isMe: true,
            },
        ]);
        setDraftMessage("");
    };

    useEffect(() => {
        if (!accountId || !threadId || ![ZaloThreadType.USER, ZaloThreadType.GROUP].includes(threadType as ZaloThreadType)) {
            setMessages([]);
            return;
        }

        let isMounted = true;

        const loadMessageHistory = async () => {
            setIsLoadingMessages(true);
            try {
                const response = await getZaloPersonalMessageHistory(
                    accountId,
                    threadId,
                    threadType as ZaloThreadType,
                    MESSAGE_PAGE,
                    MESSAGE_LIMIT,
                );

                if (!isMounted) return;

                const mappedMessages: ChatMessage[] = (response.data?.items || []).map((item) => ({
                    id: item._id || item.msgId,
                    senderName: item.dName || "Không rõ",
                    content: item.content || "",
                    msgType: item.msgType || ZaloMsgTypeEnum.UNKNOWN,
                    createdAt: formatTime(item.createdAt),
                    isMe: threadType === ZaloThreadType.USER ? item.uidFrom !== threadId : false,
                }));

                setMessages(mappedMessages.reverse());
            } catch (error) {
                console.error("Failed to load zalo message history", error);
                if (isMounted) {
                    setMessages([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingMessages(false);
                }
            }
        };

        loadMessageHistory();
        return () => {
            isMounted = false;
        };
    }, [accountId, threadId, threadType]);

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
            <MessageChatHeader fullName={fullName} avatarUrl={avatarUrl} />
            <MessageChatList isLoadingMessages={isLoadingMessages} messages={messages} />
            <MessageChatComposer draftMessage={draftMessage} setDraftMessage={setDraftMessage} onSubmit={handleSendMessage} />
        </div>
    )
}
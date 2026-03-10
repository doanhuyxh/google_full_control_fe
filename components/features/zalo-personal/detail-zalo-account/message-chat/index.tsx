import useIndexedDBStorage from "@/libs/hooks/useIndexedDBStorage";
import useLocalStorage from "@/libs/hooks/useLocalStorage";
import useSearchParamsClient from "@/libs/hooks/useSearchParamsClient";
import { useSocketManager } from "@/libs/hooks/useSocketManager";
import { ChangedProfiles, ZaloGroupInfo, ZaloLoginInfo, ZaloThreadType } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { ZaloMsgTypeEnum } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { getZaloPersonalMessageHistory, sendMessageToZaloGroup, sendMessageToZaloUser } from "@/libs/network/zalo-personal.api";
import { useAppSelector } from "@/libs/redux/hooks";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import MessageChatComposer from "./MessageChatComposer";
import MessageChatHeader from "./MessageChatHeader";
import MessageChatList from "./MessageChatList";
import { ZaloWebhookMessagePayload, ChatMessage } from "@/libs/intefaces/zaloPersonal/zaloAccData";

interface MessageChatZaloAccountProps {
    accountId: string;
}

const MESSAGE_PAGE = 1;
const MESSAGE_LIMIT = 100;
const EMPTY_FRIENDS: ChangedProfiles[] = [];
const EMPTY_GROUPS: ZaloGroupInfo[] = [];

const getMessageIdentity = (messageLike: {
    msgId?: string | number;
    _id?: string | number;
    id?: string | number;
}): string => {
    const rawId = messageLike.msgId || messageLike._id || messageLike.id;
    return rawId ? String(rawId) : "";
};


const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};

const mapHistoryItemsToChatMessages = (
    items: any[],
    currentThreadType: ZaloThreadType,
    currentThreadId: string,
    currentZaloId: string,
): ChatMessage[] => {
    return items.map((item) => ({
        id: getMessageIdentity(item),
        senderName: item.dName || "Không rõ",
        content: item.content || "",
        msgType: item.msgType || ZaloMsgTypeEnum.UNKNOWN,
        createdAt: formatTime(item.createdAt),
        isMe: currentThreadType === ZaloThreadType.USER
            ? item.uidFrom !== currentThreadId
            : item.uidFrom === currentZaloId,
    }));
};

export default function MessageChatZaloAccount({ accountId }: MessageChatZaloAccountProps) {
    const { connectSocket, disconnectSocket, getSocket } = useSocketManager();
    const [threadTypeRaw] = useSearchParamsClient<string>("threadType", "");
    const [threadId] = useSearchParamsClient<string>("threadId", "");
    const [fullName, setFullName] = useState<string>("Vui lòng chọn cuộc trò chuyện");
    const [avatarUrl, setAvatarUrl] = useState<string>("https://static-zmp3.zadn.vn/default_avatar.png");
    const reduxFriends = useAppSelector((state) => state.zaloDetail.friendsByAccount[accountId] || EMPTY_FRIENDS);
    const reduxGroups = useAppSelector((state) => state.zaloDetail.groupsByAccount[accountId] || EMPTY_GROUPS);
    const [cachedFriends] = useIndexedDBStorage<ChangedProfiles[]>(`zalo-personal-friends:${accountId}`, []);
    const [groupDetails] = useIndexedDBStorage<ZaloGroupInfo[]>(`groupDetails_${accountId}`, []);
    const [zaloInfo] = useLocalStorage<ZaloLoginInfo | null>("zaloInfoDetail", null);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draftMessage, setDraftMessage] = useState<string>("");
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const activeThreadIdRef = useRef<string>(threadId);
    const activeThreadTypeRef = useRef<number>(Number(threadTypeRaw));
    const threadType = useMemo(() => Number(threadTypeRaw), [threadTypeRaw]);
    const currentZaloId = useMemo(() => zaloInfo?.info?.current_zalo_id || "", [zaloInfo]);
    const friendsData = useMemo(() => (reduxFriends.length > 0 ? reduxFriends : cachedFriends), [reduxFriends, cachedFriends]);
    const groupsData = useMemo(() => (reduxGroups.length > 0 ? reduxGroups : groupDetails), [reduxGroups, groupDetails]);

    const loadMessageHistory = useCallback(async () => {
        const response = await getZaloPersonalMessageHistory(
            accountId,
            threadId,
            threadType as ZaloThreadType,
            MESSAGE_PAGE,
            MESSAGE_LIMIT,
        );

        const mappedMessages = mapHistoryItemsToChatMessages(
            response.data?.items || [],
            threadType as ZaloThreadType,
            threadId,
            currentZaloId,
        );

        return mappedMessages.reverse();
    }, [accountId, threadId, threadType, currentZaloId]);

    useEffect(() => {
        activeThreadIdRef.current = threadId;
        activeThreadTypeRef.current = threadType;
    }, [threadId, threadType]);

    const handleSendMessage = async (event: FormEvent) => {
        event.preventDefault();

        const trimmedContent = draftMessage.trim();
        if (!trimmedContent) return;

        const now = new Date();
        const createdAt = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        let sentMsgId = "";

        switch (threadType) {
            case ZaloThreadType.USER:
                sentMsgId = String((await sendMessageToZaloUser(accountId, threadId, trimmedContent)).data?.data?.msgId || "");
                break;
            case ZaloThreadType.GROUP:
                sentMsgId = String((await sendMessageToZaloGroup(accountId, threadId, trimmedContent)).data?.data?.msgId || "");
                break;
            default:
                console.warn("Unknown thread type:", threadType);
                return;
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                id: sentMsgId || `${Date.now()}`,
                senderName: "Bạn",
                content: trimmedContent,
                msgType: ZaloMsgTypeEnum.WEBCHAT,
                createdAt,
                isMe: true,
            },
        ]);
        setDraftMessage("");
    };

    const handleZaloWebhookMessage = (eventData: { data?: ZaloWebhookMessagePayload } | ZaloWebhookMessagePayload) => {
        const payload = (("data" in eventData ? eventData.data : eventData) || null) as ZaloWebhookMessagePayload | null;
        if (!payload) return;

        if (payload.type && payload.type !== "new_message") return;

        const conversation = payload.conversation || payload;
        const message = payload.message || payload;
        const payloadAccountId = conversation.zaloPersonalAccountId || conversation.accountId;
        if (payloadAccountId && payloadAccountId !== accountId) return;

        const payloadThreadId = conversation.threadId;
        const payloadThreadType = Number(conversation.threadType);
        if (!payloadThreadId || ![ZaloThreadType.USER, ZaloThreadType.GROUP].includes(payloadThreadType)) return;
        if (payloadThreadId !== activeThreadIdRef.current || payloadThreadType !== activeThreadTypeRef.current) return;

        if (!message.content && !message.msgType) return;

        const incomingMessageId = getMessageIdentity(message) || getMessageIdentity(conversation) || `${payloadThreadId}:${conversation.lastMessageAt || Date.now()}`;

        const incomingMessage: ChatMessage = {
            id: incomingMessageId,
            senderName: message.dName || "Không rõ",
            content: message.content || "",
            msgType: message.msgType || ZaloMsgTypeEnum.UNKNOWN,
            createdAt: formatTime(message.createdAt || message.sentAt || conversation.lastMessageAt || new Date().toISOString()),
            isMe: payloadThreadType === ZaloThreadType.USER
                ? message.uidFrom !== payloadThreadId
                : message.uidFrom === currentZaloId,
        };

        setMessages((prevMessages) => {
            if (prevMessages.some((message) => String(message.id) === incomingMessage.id)) return prevMessages;
            return [...prevMessages, incomingMessage];
        });
    };

    useEffect(() => {
        if (!accountId || !threadId || ![ZaloThreadType.USER, ZaloThreadType.GROUP].includes(threadType as ZaloThreadType)) {
            setMessages([]);
            return;
        }

        let isMounted = true;

        const runLoadMessageHistory = async () => {
            setIsLoadingMessages(true);
            try {
                const mappedMessages = await loadMessageHistory();
                if (!isMounted) return;

                setMessages(mappedMessages);
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

        runLoadMessageHistory();
        return () => {
            isMounted = false;
        };
    }, [accountId, threadId, threadType, loadMessageHistory]);

    useEffect(() => {
        if (!accountId) return;

        connectSocket("zalo");
        const zaloSocket = getSocket();
        if (!zaloSocket) return;

        zaloSocket.on("zaloWebhookMessage", handleZaloWebhookMessage);

        return () => {
            zaloSocket.off("zaloWebhookMessage", handleZaloWebhookMessage);
            disconnectSocket();
        };
    }, [accountId]);

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
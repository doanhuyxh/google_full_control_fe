import { Empty, Spin } from "antd";
import { useEffect, useRef } from "react";
import MessageChatItem from "../MessageChatItem";
import { ChatMessage } from "../types";

interface MessageChatListProps {
    isLoadingMessages: boolean;
    messages: ChatMessage[];
}

export default function MessageChatList({ isLoadingMessages, messages }: MessageChatListProps) {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoadingMessages) return;

        requestAnimationFrame(() => {
            if (!listRef.current) return;
            listRef.current.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: "auto",
            });
        });
    }, [messages, isLoadingMessages]);

    return (
        <div ref={listRef} className="flex-1 max-h-[65vh] overflow-y-auto py-4 space-y-3">
            {isLoadingMessages ? (
                <div className="h-full min-h-60 flex items-center justify-center">
                    <Spin />
                </div>
            ) : messages.length === 0 ? (
                <div className="h-full min-h-60 flex items-center justify-center">
                    <Empty description="Chưa có tin nhắn" />
                </div>
            ) : (
                messages.map((message) => (
                    <MessageChatItem key={message.id} message={message} />
                ))
            )}
        </div>
    );
}

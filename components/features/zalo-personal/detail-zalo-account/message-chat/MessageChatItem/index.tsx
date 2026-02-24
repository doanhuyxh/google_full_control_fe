import MessageChatContent from "../MessageChatContent";
import { ChatMessage } from "../types";

interface MessageChatItemProps {
    message: ChatMessage;
}

export default function MessageChatItem({ message }: MessageChatItemProps) {
    return (
        <div className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[90%] rounded-2xl px-3 py-2 ${message.isMe
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
            >
                {!message.isMe && (
                    <p className="text-xs font-medium mb-1 text-gray-600">{message.senderName}</p>
                )}
                <div className="whitespace-pre-wrap wrap-break-word text-sm">
                    <MessageChatContent msgType={message.msgType} content={message.content} />
                </div>
                <p
                    className={`text-[11px] mt-1 ${message.isMe ? "text-blue-100" : "text-gray-500"
                        }`}
                >
                    {message.createdAt}
                </p>
            </div>
        </div>
    );
}

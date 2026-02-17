import { ContentPhoto, ContentVoice } from "@/libs/intefaces/zaloPersonal";
import { ZaloMsgTypeEnum } from "@/libs/intefaces/zaloPersonal/zaloAccData";
import { Image } from "antd";
import { ReactNode } from "react";

interface MessageChatContentProps {
    msgType: string;
    content: ContentPhoto | ContentVoice | string;
}

const isMediaContent = (value: unknown): value is ContentPhoto | ContentVoice => {
    return !!value && typeof value === "object";
};

const renderMessageContent = (msgType: string, content: ContentPhoto | ContentVoice | string): ReactNode => {
    if (typeof content === "string") {
        if (msgType === ZaloMsgTypeEnum.DELETE) return "Tin nhắn đã bị thu hồi";
        return content;
    }

    if (!isMediaContent(content)) return "[Không hỗ trợ nội dung]";

    const displayText = content.title || content.description || "Nội dung đính kèm";
    const hasHref = !!content.href;

    switch (msgType) {
        case ZaloMsgTypeEnum.PHOTO:
        case ZaloMsgTypeEnum.GIF: {
            const imageUrl = content.href || content.thumb;
            if (!imageUrl) return `🖼️ ${displayText}`;

            return (
                <div className="space-y-1">
                    <Image
                        src={imageUrl}
                        alt={displayText}
                        width={220}
                        className="rounded-lg object-cover"
                        preview={{ src: imageUrl }}
                    />
                    <a href={imageUrl} target="_blank" rel="noreferrer" className="underline text-xs">
                        Mở ảnh gốc
                    </a>
                </div>
            );
        }
        case ZaloMsgTypeEnum.VOICE:
            return hasHref ? <a href={content.href} target="_blank" rel="noreferrer" className="underline">🎤 {displayText}</a> : `🎤 ${displayText}`;
        case ZaloMsgTypeEnum.VIDEO:
            return hasHref ? <a href={content.href} target="_blank" rel="noreferrer" className="underline">🎬 {displayText}</a> : `🎬 ${displayText}`;
        case ZaloMsgTypeEnum.FILE:
            return hasHref ? <a href={content.href} target="_blank" rel="noreferrer" className="underline">📎 {displayText}</a> : `📎 ${displayText}`;
        case ZaloMsgTypeEnum.LINK:
            return hasHref ? <a href={content.href} target="_blank" rel="noreferrer" className="underline">🔗 {displayText}</a> : `🔗 ${displayText}`;
        case ZaloMsgTypeEnum.STICKER:
            return `😊 ${displayText}`;
        default:
            return hasHref ? <a href={content.href} target="_blank" rel="noreferrer" className="underline">{displayText}</a> : displayText;
    }
};

export default function MessageChatContent({ msgType, content }: MessageChatContentProps) {
    return <>{renderMessageContent(msgType, content)}</>;
}

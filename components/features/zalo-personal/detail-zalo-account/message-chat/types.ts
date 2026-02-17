import { ContentPhoto, ContentVoice } from "@/libs/intefaces/zaloPersonal";

export type ChatMessage = {
    id: string;
    senderName: string;
    content: ContentPhoto | ContentVoice | string;
    msgType: string;
    createdAt: string;
    isMe: boolean;
};

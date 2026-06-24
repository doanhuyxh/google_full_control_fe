import { FormEvent, KeyboardEvent, useRef } from "react";

interface MessageChatComposerProps {
    draftMessage: string;
    setDraftMessage: (value: string) => void;
    onSubmit: (event: FormEvent) => void;
}

export default function MessageChatComposer({ draftMessage, setDraftMessage, onSubmit }: MessageChatComposerProps) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== "Enter") return;
        if (event.shiftKey) return;

        event.preventDefault();
        if (!draftMessage.trim()) return;
        formRef.current?.requestSubmit();
    };

    return (
        <form ref={formRef} onSubmit={onSubmit} className="pt-3 border-t border-gray-200">
            <div className="flex items-end gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-white">
                <textarea
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    onKeyDown={handleKeyDown}
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
    );
}

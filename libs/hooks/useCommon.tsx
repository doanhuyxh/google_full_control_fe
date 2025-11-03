import { App } from "antd";

export function useCommon() {
    const { message } = App.useApp();

    const sleep = (s: number) =>
        new Promise((resolve) => setTimeout(resolve, s * 1000));

    const copiedToClipboard = async (text: string) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                message.success({
                    content: "Copied to clipboard",
                    duration: 2,
                });
            } else {
                message.error({
                    content: "Clipboard API not supported",
                    duration: 2,
                });
            }
        } catch {
            message.error({
                content: "Failed to copy to clipboard",
                duration: 2,
            });
        }
    };

    return { sleep, copiedToClipboard };
}

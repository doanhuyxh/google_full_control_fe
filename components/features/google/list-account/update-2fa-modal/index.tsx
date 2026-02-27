"use client";

import { useEffect, useState } from "react";
import { Modal, Button, List, Tag, Spin, Alert, Typography } from "antd";
import { QrCode, CheckCircle, RotateCcw, VideoOff } from "lucide-react";
import { useQrScanner } from "@/libs/hooks/useScanQrImage";
import { getAuthenticatorData } from "@/libs/network/authenticator.api";
import { AuthenticatorData } from "@/libs/intefaces/authenticatorData";
import { useAntdApp } from "@/libs/hooks/useAntdApp";

const SCANNER_ID = "google-2fa-qr-scanner";

interface Update2FAModalProps {
    isShowModal: boolean;
    accountId: string | undefined;
    onClose: () => void;
    onUpdate: (id: string, field: string, value: any) => Promise<void>;
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 639px)");
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    return isMobile;
}

export default function Update2FAModal({
    isShowModal,
    accountId,
    onClose,
    onUpdate,
}: Update2FAModalProps) {
    const [authList, setAuthList] = useState<AuthenticatorData[]>([]);
    const [loadingParse, setLoadingParse] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
    const [applyingSecret, setApplyingSecret] = useState<string | null>(null);
    const isMobile = useIsMobile();
    // Suppress unused warning – kept for future notification use
    const { notification: _notification } = useAntdApp();

    const { start, stop, isScanning, scannedText, clearScannedText } = useQrScanner(
        SCANNER_ID,
        { stopAfterSuccess: true, showMessage: true }
    );

    /* Khi quét xong → gọi API parse */
    useEffect(() => {
        if (!scannedText) return;
        const parse = async () => {
            setLoadingParse(true);
            setParseError(null);
            try {
                const data = await getAuthenticatorData(scannedText);
                setAuthList(data);
            } catch {
                setParseError("Không thể đọc mã QR. Hãy thử lại.");
                setAuthList([]);
            } finally {
                setLoadingParse(false);
            }
        };
        parse();
    }, [scannedText]);

    /* Reset khi đóng modal */
    const handleClose = () => {
        stop();
        clearScannedText();
        setAuthList([]);
        setParseError(null);
        onClose();
    };

    /* Áp dụng secret vào tài khoản */
    const handleApply = async (item: AuthenticatorData) => {
        if (!accountId) return;
        setApplyingSecret(item.secret);
        try {
            await onUpdate(accountId, "f2a", item.secret_code);
            handleClose();
        } finally {
            setApplyingSecret(null);
        }
    };

    /* Quét lại */
    const handleRescan = () => {
        clearScannedText();
        setAuthList([]);
        setParseError(null);
        start();
    };

    /* Tự start camera khi modal mở */
    useEffect(() => {
        if (isShowModal) {
            const timer = setTimeout(() => start(), 300);
            return () => clearTimeout(timer);
        } else {
            stop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isShowModal]);

    return (
        <Modal
            open={isShowModal}
            onCancel={handleClose}
            footer={null}
            /* Mobile: full-width sát cạnh màn hình; Desktop: 440px */
            width={isMobile ? "100%" : 440}
            style={isMobile ? { top: 0, margin: 0, maxWidth: "100vw", padding: 0 } : undefined}
            styles={isMobile ? { body: { padding: "12px", maxHeight: "90dvh", overflowY: "auto" } } : { body: { padding: "16px" } }}
            classNames={{
                content: isMobile ? "!rounded-none sm:!rounded-lg" : "",
            }}
            title={
                <div className="flex items-center gap-2">
                    <QrCode size={18} />
                    <span className="text-base font-semibold">Quét mã QR 2FA</span>
                </div>
            }
        >
            <div className="flex flex-col gap-4">
                {/* Camera scanner */}
                {!scannedText && (
                    <>
                        {/* Khung camera – vuông theo chiều rộng */}
                        <div
                            id={SCANNER_ID}
                            className="w-full rounded-lg overflow-hidden bg-black"
                            style={{ aspectRatio: "1 / 1", maxHeight: isMobile ? "55dvh" : 320 }}
                        />

                        {/* Nút bật/tắt camera */}
                        <div className="flex gap-2">
                            {!isScanning ? (
                                <Button
                                    type="primary"
                                    icon={<QrCode size={15} />}
                                    onClick={start}
                                    block
                                    size={isMobile ? "large" : "middle"}
                                >
                                    Bật camera
                                </Button>
                            ) : (
                                <Button
                                    danger
                                    icon={<VideoOff size={15} />}
                                    onClick={stop}
                                    block
                                    size={isMobile ? "large" : "middle"}
                                >
                                    Dừng quét
                                </Button>
                            )}
                        </div>
                    </>
                )}

                {/* Đang parse */}
                {loadingParse && (
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <Spin size="large" />
                        <Typography.Text type="secondary" className="text-sm">
                            Đang đọc dữ liệu 2FA…
                        </Typography.Text>
                    </div>
                )}

                {/* Lỗi parse */}
                {parseError && (
                    <div className="flex flex-col gap-3">
                        <Alert type="error" message={parseError} showIcon />
                        <Button
                            icon={<RotateCcw size={14} />}
                            onClick={handleRescan}
                            block
                            size={isMobile ? "large" : "middle"}
                        >
                            Quét lại
                        </Button>
                    </div>
                )}

                {/* Danh sách 2FA accounts */}
                {!loadingParse && authList.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <Typography.Text type="secondary" className="text-xs">
                            Tìm thấy <strong>{authList.length}</strong> tài khoản — chọn để cập nhật mã 2FA:
                        </Typography.Text>

                        <List
                            bordered
                            size="small"
                            dataSource={authList}
                            renderItem={(item) => (
                                <List.Item className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
                                    {/* Info */}
                                    <div className="flex flex-col gap-1 w-full">
                                        <Typography.Text strong className="text-sm leading-tight">
                                            {item.name || item.issuer || "(Không tên)"}
                                        </Typography.Text>
                                        {item.issuer && item.issuer !== item.name && (
                                            <Tag color="blue" className="w-fit text-xs">
                                                {item.issuer}
                                            </Tag>
                                        )}
                                        <Typography.Text
                                            type="secondary"
                                            className="text-xs font-mono break-all"
                                            copyable={{ text: item.secret }}
                                        >
                                            {item.secret}
                                        </Typography.Text>
                                    </div>

                                    {/* Nút áp dụng – full-width trên mobile */}
                                    <Button
                                        type="primary"
                                        icon={<CheckCircle size={14} />}
                                        loading={applyingSecret === item.secret}
                                        onClick={() => handleApply(item)}
                                        block
                                        size={isMobile ? "large" : "middle"}
                                    >
                                        Áp dụng
                                    </Button>
                                </List.Item>
                            )}
                        />

                        <Button
                            icon={<RotateCcw size={14} />}
                            onClick={handleRescan}
                            block
                            size={isMobile ? "large" : "middle"}
                        >
                            Quét lại
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { Modal, Button, List, Tag, Typography, Alert } from "antd";
import { QrCode, CheckCircle, RotateCcw, VideoOff, Camera, ScanLine, KeyRound, BadgeCheck } from "lucide-react";
import { useQrScanner } from "@/libs/hooks/useScanQrImage";
import { getAuthenticatorData } from "@/libs/network/authenticator.api";
import { AuthenticatorData } from "@/libs/intefaces/authenticatorData";

const SCANNER_ID = "tiktok-2fa-qr-scanner";

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

export default function TikTokUpdate2FAModal({
    isShowModal,
    accountId,
    onClose,
    onUpdate,
}: Update2FAModalProps) {
    const [authList, setAuthList] = useState<AuthenticatorData[]>([]);
    const [loadingParse, setLoadingParse] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
    const [applyingSecret, setApplyingSecret] = useState<string | null>(null);
    const [cameraOpening, setCameraOpening] = useState(false);
    const isMobile = useIsMobile();

    const { start: _start, stop, isScanning, scannedText, clearScannedText } = useQrScanner(
        SCANNER_ID,
        { stopAfterSuccess: true, showMessage: false }
    );

    const start = useCallback(() => {
        setCameraOpening(true);
        _start();
    }, [_start]);

    useEffect(() => {
        if (isScanning) setCameraOpening(false);
    }, [isScanning]);

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

    const handleClose = () => {
        stop();
        clearScannedText();
        setAuthList([]);
        setParseError(null);
        setCameraOpening(false);
        onClose();
    };

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

    const handleRescan = () => {
        clearScannedText();
        setAuthList([]);
        setParseError(null);
        start();
    };

    useEffect(() => {
        if (isShowModal) {
            const timer = setTimeout(() => start(), 300);
            return () => clearTimeout(timer);
        } else {
            stop();
            setCameraOpening(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isShowModal]);

    const currentStep = (() => {
        if (authList.length > 0) return 3;
        if (loadingParse) return 2;
        if (isScanning || scannedText) return 1;
        if (cameraOpening) return 0;
        return -1;
    })();

    const TOTAL_STEPS = 4;

    const stepMeta: { icon: React.ReactNode; label: string; color: string }[] = [
        { icon: <Camera size={14} />, label: "Đang mở camera…", color: "text-blue-500" },
        { icon: <ScanLine size={14} />, label: "Đang quét QR…", color: "text-amber-500" },
        { icon: <KeyRound size={14} />, label: "Đang giải mã…", color: "text-violet-500" },
        { icon: <BadgeCheck size={14} />, label: "Hoàn tất!", color: "text-green-500" },
    ];

    const activeStep = currentStep >= 0 && currentStep < TOTAL_STEPS ? stepMeta[currentStep] : null;

    return (
        <Modal
            open={isShowModal}
            onCancel={handleClose}
            footer={null}
            width={isMobile ? "100%" : 440}
            style={isMobile ? { top: 0, margin: 0, maxWidth: "100vw", padding: 0 } : undefined}
            styles={isMobile ? { body: { padding: "12px", maxHeight: "90dvh", overflowY: "auto" } } : { body: { padding: "16px" } }}
            classNames={{ content: isMobile ? "!rounded-none sm:!rounded-lg" : "" }}
            title={
                <div className="flex items-center gap-2">
                    <QrCode size={18} />
                    <span className="text-base font-semibold">Quét mã QR 2FA</span>
                </div>
            }
        >
            <div className="flex flex-col gap-4">
                {currentStep >= 0 && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center w-full max-w-[260px]">
                            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                                const done = i < currentStep;
                                const active = i === currentStep;
                                const isLast = i === TOTAL_STEPS - 1;
                                return (
                                    <div key={i} className="flex items-center flex-1 last:flex-none">
                                        <div
                                            className={[
                                                "w-3 h-3 rounded-full border-2 transition-all duration-300 shrink-0",
                                                done
                                                    ? "bg-green-500 border-green-500 scale-100"
                                                    : active
                                                        ? "border-blue-500 bg-blue-500 scale-125 animate-pulse"
                                                        : "border-gray-300 bg-white scale-100",
                                            ].join(" ")}
                                        />
                                        {!isLast && (
                                            <div className="flex-1 h-0.5 mx-1">
                                                <div
                                                    className={[
                                                        "h-full rounded transition-all duration-500",
                                                        done ? "bg-green-400" : "bg-gray-200",
                                                    ].join(" ")}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {activeStep && (
                            <span className={`flex items-center gap-1.5 text-sm font-medium ${activeStep.color}`}>
                                {activeStep.icon}
                                {activeStep.label}
                            </span>
                        )}
                    </div>
                )}

                <div className={scannedText ? "hidden" : ""}>
                    <div className="relative w-full rounded-lg overflow-hidden"
                        style={{ aspectRatio: "1 / 1", maxHeight: isMobile ? "55dvh" : 320 }}
                    >
                        <div
                            id={SCANNER_ID}
                            className="absolute inset-0 bg-black"
                        />

                        {cameraOpening && !isScanning && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 z-10">
                                <Camera size={32} className="text-white animate-pulse" />
                                <span className="text-white text-sm">Đang mở camera…</span>
                            </div>
                        )}
                        {isScanning && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="border-2 border-white/70 rounded-xl"
                                    style={{ width: "65%", height: "65%", boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)" }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 mt-4">
                        {!isScanning && !cameraOpening ? (
                            <Button
                                type="primary"
                                icon={<QrCode size={15} />}
                                onClick={start}
                                block
                                size={isMobile ? "large" : "middle"}
                            >
                                Bật camera
                            </Button>
                        ) : isScanning ? (
                            <Button
                                danger
                                icon={<VideoOff size={15} />}
                                onClick={stop}
                                block
                                size={isMobile ? "large" : "middle"}
                            >
                                Dừng quét
                            </Button>
                        ) : (
                            <Button block disabled size={isMobile ? "large" : "middle"} loading>
                                Đang mở camera…
                            </Button>
                        )}
                    </div>
                </div>

                {loadingParse && (
                    <div className="flex flex-col items-center justify-center gap-3 py-6">
                        <KeyRound size={32} className="text-blue-500 animate-bounce" />
                        <Typography.Text type="secondary" className="text-sm">
                            Đang giải mã dữ liệu 2FA…
                        </Typography.Text>
                    </div>
                )}

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
                                <List.Item className="flex flex-col items-stretch gap-2 px-3 py-3">
                                    <div className="flex flex-col gap-1 w-full">
                                        <Typography.Text strong className="text-sm leading-tight">
                                            {item.name || item.issuer || "(Không tên)"}
                                        </Typography.Text>
                                        {item.issuer && item.issuer !== item.name && (
                                            <Tag color="blue" className="w-fit text-xs">{item.issuer}</Tag>
                                        )}
                                        <Typography.Text
                                            type="secondary"
                                            className="text-xs font-mono break-all"
                                            copyable={{ text: item.secret_code }}
                                        >
                                            {item.secret_code}
                                        </Typography.Text>
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<CheckCircle size={14} />}
                                        loading={applyingSecret === item.secret_code}
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

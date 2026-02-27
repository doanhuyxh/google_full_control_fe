"use client";

import { useEffect, useState } from "react";
import { Modal, Button, List, Tag, Spin, Alert, Typography } from "antd";
import { QrCode, CheckCircle } from "lucide-react";
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
    const { notification } = useAntdApp();

    const { start, stop, isScanning, scannedText, clearScannedText } = useQrScanner(
        SCANNER_ID,
        {
            stopAfterSuccess: true,
            showMessage: true,
        }
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
            await onUpdate(accountId, "f2a", item.secret);
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
            // Đợi DOM render xong
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
            width={440}
            title={
                <div className="flex items-center gap-2">
                    <QrCode size={18} />
                    <span>Quét mã QR 2FA</span>
                </div>
            }
        >
            <div className="flex flex-col gap-4 py-2">
                {/* Camera scanner */}
                {!scannedText && (
                    <>
                        <div
                            id={SCANNER_ID}
                            className="w-full rounded-lg overflow-hidden bg-black"
                            style={{ minHeight: 280 }}
                        />
                        <div className="flex justify-center gap-2">
                            {!isScanning ? (
                                <Button
                                    type="primary"
                                    icon={<QrCode size={14} />}
                                    onClick={start}
                                >
                                    Bật camera
                                </Button>
                            ) : (
                                <Button danger onClick={stop}>
                                    Dừng quét
                                </Button>
                            )}
                        </div>
                    </>
                )}

                {/* Đang parse */}
                {loadingParse && (
                    <div className="flex justify-center py-6">
                        <Spin tip="Đang đọc dữ liệu 2FA..." />
                    </div>
                )}

                {/* Lỗi parse */}
                {parseError && (
                    <div className="flex flex-col gap-2">
                        <Alert type="error" message={parseError} showIcon />
                        <Button onClick={handleRescan} block>
                            Quét lại
                        </Button>
                    </div>
                )}

                {/* Danh sách 2FA accounts */}
                {!loadingParse && authList.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <Typography.Text type="secondary" className="text-xs">
                            Tìm thấy <strong>{authList.length}</strong> tài khoản — chọn tài khoản để cập nhật mã 2FA:
                        </Typography.Text>
                        <List
                            bordered
                            size="small"
                            dataSource={authList}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            key="apply"
                                            type="primary"
                                            size="small"
                                            icon={<CheckCircle size={13} />}
                                            loading={applyingSecret === item.secret}
                                            onClick={() => handleApply(item)}
                                        >
                                            Áp dụng
                                        </Button>,
                                    ]}
                                >
                                    <div className="flex flex-col gap-1">
                                        <Typography.Text strong className="text-sm">
                                            {item.name || item.issuer || "(Không tên)"}
                                        </Typography.Text>
                                        {item.issuer && item.issuer !== item.name && (
                                            <Tag color="blue" className="w-fit text-xs">
                                                {item.issuer}
                                            </Tag>
                                        )}
                                        <Typography.Text
                                            type="secondary"
                                            className="text-xs font-mono"
                                            copyable={{ text: item.secret }}
                                        >
                                            {item.secret}
                                        </Typography.Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                        <Button onClick={handleRescan} block>
                            Quét lại
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}

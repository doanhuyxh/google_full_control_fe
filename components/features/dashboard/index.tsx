"use client";
import { Button, Space, Card, Row, Col, Typography, Divider, Alert, Empty } from "antd";
import { useState, useEffect, useRef } from "react";
import {
    CameraOutlined,
    DesktopOutlined,
    StopOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";

import { useModal } from "@/libs/hooks/useModal";
import { CustomModal, InfoModal } from "@/components/common/modal";
import useMediaStream from "@/libs/hooks/useMediaStream";
import { useQrScanner } from "@/libs/hooks/useScanQrImage";

const { Title, Text } = Typography;

export default function DashboardPage() {
    const modal = useModal();
    const { stream, error, startCamera, startScreenShare, stopStream, capturePhoto } = useMediaStream();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [customModalOpen, setCustomModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);

    const { start, stop, isScanning, scannedText } = useQrScanner("reader", {
        showMessage: true,
        stopAfterSuccess: true,
        onSuccess: (text) => {
            console.log("QR:", text);
        },
    });

    // --- Modal Handlers (Giữ nguyên logic của bạn) ---
    const handleShowConfirmModal = () => {
        modal.showConfirm({
            title: 'Xác nhận thao tác',
            content: 'Bạn có chắc chắn muốn thực hiện thao tác này không?',
            onOk: () => {
                modal.showSuccess({ title: 'Thành công!', content: 'Thao tác hoàn tất.' });
            },
        });
    };

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);


    useEffect(() => {
        console.log("Scanned QR Code:", scannedText);
    }, [scannedText]);

    return (
        <div className="w-full max-w-full overflow-x-hidden">
            <Title level={2} className="mb-2! md:mb-4!">Hệ thống Dashboard Demo</Title>
            <Divider />

            <Row gutter={[12, 12]}>
                <Col xs={24} lg={10}>
                    <Card title="📍 Quản lý Modal" className="shadow-sm">
                        <Text type="secondary" className="block mb-6">
                            Thử nghiệm các loại thông báo và hộp thoại tương tác:
                        </Text>
                        <div className="flex flex-col gap-4">
                            <Space wrap>
                                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleShowConfirmModal}>
                                    Xác nhận
                                </Button>
                                <Button icon={<ExclamationCircleOutlined />} onClick={() => modal.showWarning({ title: 'Cảnh báo', content: 'Nội dung cảnh báo!' })}>
                                    Cảnh báo
                                </Button>
                                <Button danger onClick={() => modal.showError({ title: 'Lỗi', content: 'Đã có lỗi xảy ra!' })}>
                                    Báo lỗi
                                </Button>
                                <Button type="dashed" icon={<InfoCircleOutlined />} onClick={() => modal.showInfo({ title: 'Thông tin', content: 'Thông tin hệ thống.' })}>
                                    Thông tin
                                </Button>
                            </Space>
                            <Divider plain>Custom Modals</Divider>
                            <Space wrap>
                                <Button onClick={() => setCustomModalOpen(true)}>Mở Custom Form</Button>
                                <Button onClick={() => setInfoModalOpen(true)}>Mở Chi tiết</Button>
                            </Space>
                        </div>
                    </Card>
                    <Card title="QR Scanner" style={{ width: "100%" }}>
                        <p>Nội dung QR: {scannedText ?? "Chưa có dữ liệu"}</p>
                        <div id="reader" style={{ width: "100%" }} />
                        <Button
                            type="primary"
                            onClick={isScanning ? stop : start}
                            style={{ marginTop: 16 }}
                            block
                        >
                            {isScanning ? "Dừng quét" : "Bắt đầu quét"}
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card
                        title="🎥 Trình xem Media Real-time"
                        className="shadow-sm"
                        extra={<Text type={stream ? "success" : "danger"}>{stream ? "● Đang kết nối" : "○ Ngoại tuyến"}</Text>}
                    >
                        {error && <Alert message={error} type="error" showIcon className="mb-4" />}

                        <div style={{
                            background: '#141414',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            aspectRatio: '16/9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            {stream ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted // Tránh bị vọng tiếng khi test
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <Empty description={<Text style={{ color: '#8c8c8c' }}>Chưa có nguồn dữ liệu</Text>} />
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            <Button
                                type={stream && !stream.getVideoTracks()[0].label.includes("screen") ? "primary" : "default"}
                                icon={<CameraOutlined />}
                                onClick={() => startCamera()}
                                className="max-sm:flex-1"
                            >
                                Bật Camera
                            </Button>
                            <Button
                                type={stream && stream.getVideoTracks()[0].label.includes("screen") ? "primary" : "default"}
                                icon={<DesktopOutlined />}
                                onClick={startScreenShare}
                                className="max-sm:flex-1"
                            >
                                Chia sẻ màn hình
                            </Button>
                            <Button
                                danger
                                type="primary"
                                icon={<StopOutlined />}
                                onClick={stopStream}
                                disabled={!stream}
                                className="max-sm:flex-1"
                            >
                                Dừng phát
                            </Button>
                            <Button className="max-sm:flex-1" onClick={async () => {
                                const photo = await capturePhoto();
                                if (photo) {
                                    console.log("Captured photo:", photo);
                                }
                            }}>Chụp ảnh</Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* --- Modals --- */}
            <CustomModal
                open={customModalOpen}
                onCancel={() => setCustomModalOpen(false)}
                title="Cấu hình hệ thống"
                onOk={() => setCustomModalOpen(false)}
            >
                <div className="py-4">Nội dung tùy chỉnh của bạn ở đây...</div>
            </CustomModal>

            <InfoModal
                open={infoModalOpen}
                onCancel={() => setInfoModalOpen(false)}
                title="Thông tin chi tiết"
            >
                <ul className="list-disc ml-6 mt-2">
                    <li>Hỗ trợ WebRTC API</li>
                    <li>Tích hợp Ant Design v5</li>
                </ul>
            </InfoModal>
        </div>
    );
}
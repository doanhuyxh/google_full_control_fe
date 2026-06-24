"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAntdApp } from "./useAntdApp";

interface UseQrScannerOptions {
    fps?: number;
    qrbox?: number | { width: number; height: number };
    showMessage?: boolean;
    stopAfterSuccess?: boolean;
    onSuccess?: (decodedText: string) => void;
    onError?: (errorMessage: string) => void;
}

export function useQrScanner(
    elementId: string,
    options?: UseQrScannerOptions
) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const isScanningRef = useRef(false);
    const isStoppingRef = useRef(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedText, setScannedText] = useState<string | null>(null);
    const { message } = useAntdApp();

    /**
     * Tắt toàn bộ camera tracks + xóa DOM container
     */
    const killCamera = useCallback(() => {
        // 1. Stop tất cả tracks từ stream đã lưu (tắt đèn camera)
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }

        // 2. Fallback: tìm video trong DOM và stop tracks luôn
        const video = document.querySelector(
            `#${elementId} video`
        ) as HTMLVideoElement | null;
        if (video?.srcObject) {
            (video.srcObject as MediaStream)
                .getTracks()
                .forEach((t) => t.stop());
            video.srcObject = null;
        }

        // 3. Xóa nội dung container (không dùng clear() của html5-qrcode
        //    vì nó gọi removeChild trên node đã detach → TypeError)
        const container = document.getElementById(elementId);
        if (container) container.innerHTML = "";
    }, [elementId]);

    /**
     * Lấy camera config (ưu tiên camera sau)
     */
    const getCameraConfig = async () => {
        try {
            const devices = await Html5Qrcode.getCameras();
            if (!devices?.length) throw new Error("No camera found");

            const back = devices.find(
                (d) =>
                    d.label.toLowerCase().includes("back") ||
                    d.label.toLowerCase().includes("rear")
            );
            return back?.id ?? devices[0].id;
        } catch {
            return { facingMode: "environment" as const };
        }
    };

    /**
     * Capture MediaStream từ video element sau khi scanner start
     */
    const captureStream = () => {
        const video = document.querySelector(
            `#${elementId} video`
        ) as HTMLVideoElement | null;
        if (video?.srcObject) {
            streamRef.current = video.srcObject as MediaStream;
        }
    };

    /**
     * Apply focus/exposure nếu thiết bị hỗ trợ
     */
    const applyAdvancedConstraints = async () => {
        if (!streamRef.current) return;
        const track = streamRef.current.getVideoTracks()[0];
        if (!track?.getCapabilities) return;

        const caps = track.getCapabilities();
        const advanced: any = {};

        if ("focusMode" in caps) advanced.focusMode = "continuous";
        if ("exposureMode" in caps) advanced.exposureMode = "continuous";
        if ("whiteBalanceMode" in caps) advanced.whiteBalanceMode = "continuous";

        if (Object.keys(advanced).length > 0) {
            try {
                await track.applyConstraints({ advanced: [advanced] });
            } catch {
                // thiết bị không hỗ trợ, bỏ qua
            }
        }
    };

    /**
     * Core stop — dùng được cả từ callback lẫn bên ngoài
     * @param showMsg hiện toast "Đã dừng quét" hay không
     */
    const doStop = useCallback(
        async (showMsg = true) => {
            if (isStoppingRef.current || !isScanningRef.current) return;
            isStoppingRef.current = true;

            try {
                await scannerRef.current?.stop();
            } catch {
                // bỏ qua lỗi stop (đã dừng rồi, v.v.)
            } finally {
                killCamera();
                scannerRef.current = null;
                isScanningRef.current = false;
                isStoppingRef.current = false;
                setIsScanning(false);

                if (showMsg && options?.showMessage !== false) {
                    message.info("Đã dừng quét");
                }
            }
        },
        [killCamera, options?.showMessage, message]
    );

    /**
     * 🚀 Start scanning
     */
    const start = useCallback(async () => {
        if (isScanningRef.current) return;

        try {
            const scanner = new Html5Qrcode(elementId);
            scannerRef.current = scanner;

            const cameraConfig = await getCameraConfig();

            await scanner.start(
                cameraConfig,
                {
                    fps: options?.fps ?? 20,
                    qrbox: options?.qrbox ?? { width: 320, height: 320 },
                    aspectRatio: 1.7778,
                    disableFlip: true,
                },
                (decodedText) => {
                    setScannedText(decodedText);

                    if (options?.showMessage !== false) {
                        message.success("Quét thành công!");
                    }

                    options?.onSuccess?.(decodedText);

                    if (options?.stopAfterSuccess !== false) {
                        // Phải defer ra ngoài scan loop của html5-qrcode.
                        // Gọi stop() trực tiếp trong callback → html5-qrcode
                        // cố removeChild node đang active → TypeError + AbortError.
                        setTimeout(() => doStop(false), 0);
                    }
                },
                (errorMessage) => {
                    options?.onError?.(errorMessage);
                }
            );

            isScanningRef.current = true;
            setIsScanning(true);

            captureStream();
            await applyAdvancedConstraints();
        } catch (err) {
            console.error(err);
            killCamera();
            scannerRef.current = null;
            isScanningRef.current = false;
            if (options?.showMessage !== false) {
                message.error("Không thể mở camera");
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementId, options, doStop, killCamera]);

    /**
     * 🛑 Stop (public)
     */
    const stop = useCallback(() => doStop(true), [doStop]);

    /**
     * Cleanup khi unmount
     */
    useEffect(() => {
        return () => {
            doStop(false);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        start,
        stop,
        isScanning,
        scannedText,
        clearScannedText: () => setScannedText(null),
    };
}

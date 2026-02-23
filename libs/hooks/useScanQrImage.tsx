"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAntdApp } from "./useAntdApp";

interface UseQrScannerOptions {
    fps?: number;
    qrbox?: number | { width: number; height: number };
    facingMode?: "environment" | "user";
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
    const [isScanning, setIsScanning] = useState(false);
    const { message } = useAntdApp();

    /**
     * 🔥 Ép camera sau thật sự
     */
    const getCameraConfig = async () => {
        try {
            const devices = await Html5Qrcode.getCameras();

            if (!devices || devices.length === 0) {
                throw new Error("No camera found");
            }

            // Tìm camera sau theo label
            const backCamera = devices.find((device) =>
                device.label.toLowerCase().includes("back") ||
                device.label.toLowerCase().includes("rear")
            );

            return backCamera?.id || devices[0].id;
        } catch (err) {
            console.log("Fallback to facingMode");
            return { facingMode: "environment" };
        }
    };


    /**
     * 🔥 Apply focus/exposure nếu thiết bị hỗ trợ
     */
    const applyAdvancedConstraints = async () => {
        const video = document.querySelector(
            `#${elementId} video`
        ) as HTMLVideoElement | null;

        if (!video?.srcObject) return;

        const stream = video.srcObject as MediaStream;
        const track = stream.getVideoTracks()[0];
        if (!track) return;

        if (!track.getCapabilities) return;

        const capabilities = track.getCapabilities();

        const advancedConstraints: any = {};

        if ("focusMode" in capabilities) {
            advancedConstraints.focusMode = "continuous";
        }

        if ("exposureMode" in capabilities) {
            advancedConstraints.exposureMode = "continuous";
        }

        if ("whiteBalanceMode" in capabilities) {
            advancedConstraints.whiteBalanceMode = "continuous";
        }

        if (Object.keys(advancedConstraints).length > 0) {
            try {
                await track.applyConstraints({
                    advanced: [advancedConstraints],
                });
            } catch (err) {
                console.log("Không apply được advanced constraints:", err);
            }
        }
    };

    /**
     * 🚀 Start scanning
     */
    const start = useCallback(async () => {
        if (isScanning) return;

        try {
            const scanner = new Html5Qrcode(elementId);
            scannerRef.current = scanner;

            const cameraConfig = await getCameraConfig();

            await scanner.start(
                cameraConfig,
                {
                    fps: options?.fps || 20,
                    qrbox:
                        options?.qrbox || { width: 320, height: 320 },
                    aspectRatio: 1.7778, // 16:9 → tránh crop kiểu portrait
                    disableFlip: true,
                },
                async (decodedText) => {
                    if (options?.showMessage !== false) {
                        message.success("Quét thành công!");
                    }

                    options?.onSuccess?.(decodedText);

                    if (options?.stopAfterSuccess !== false) {
                        await stop();
                    }
                },
                (errorMessage) => {
                    options?.onError?.(errorMessage);
                }
            );

            setIsScanning(true);

            // 🔥 Apply focus sau khi camera đã start
            await applyAdvancedConstraints();
        } catch (err) {
            console.log(err);
            if (options?.showMessage !== false) {
                message.error("Không thể mở camera");
            }
        }
    }, [elementId, isScanning, options]);

    /**
     * 🛑 Stop scanning
     */
    const stop = useCallback(async () => {
        if (!scannerRef.current || !isScanning) return;

        try {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
            setIsScanning(false);

            if (options?.showMessage !== false) {
                message.info("Đã dừng quét");
            }
        } catch (err) {
            console.log(err);
        }
    }, [isScanning, options]);

    /**
     * Cleanup khi unmount
     */
    useEffect(() => {
        return () => {
            stop();
        };
    }, [stop]);

    return {
        start,
        stop,
        isScanning,
    };
}

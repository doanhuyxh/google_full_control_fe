"use client";

import { useState, useCallback } from "react";
import { useAntdApp } from "./useAntdApp";

const useMediaStream = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {notification} = useAntdApp();

    // Hàm lấy Camera
    const startCamera = useCallback(async (constraints = { video: true, audio: true }) => {
        setLoading(true);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.name + ": " + err.message : "An unknown error occurred";
            setError(errorMessage);
            notification.error({
                message: "Lỗi khi truy cập Camera",
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm lấy Screen (Màn hình)
    const startScreenShare = useCallback(async () => {
        setLoading(true);
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });
            setStream(screenStream);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.name + ": " + err.message : "An unknown error occurred";
            setError(errorMessage);
            notification.error({
                message: "Lỗi khi chia sẻ màn hình",
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Hàm chụp ảnh từ stream
    const capturePhoto = useCallback(async (): Promise<File | null> => {
        if (!stream) {
            notification.warning({
                message: "Không có nguồn dữ liệu",
                description: "Vui lòng bật camera hoặc chia sẻ màn hình trước khi chụp ảnh."
            });
            return null;
        };
        const video = document.createElement("video");
        video.srcObject = stream;
        video.playsInline = true;
        await video.play();
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return resolve(null);
                const fileName = `photo_${Date.now()}.png`;
                const file = new File([blob], fileName, {
                    type: "image/png",
                });
                // ✅ Tự động download
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                resolve(file);
            }, "image/png");
        });
    }, [stream]);


    // Hàm dừng stream
    const stopStream = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    }, [stream]);

    return {
        stream,
        error,
        loading,
        startCamera,
        startScreenShare,
        stopStream,
        capturePhoto, // 👈 thêm vào đây
    };
};

export default useMediaStream;

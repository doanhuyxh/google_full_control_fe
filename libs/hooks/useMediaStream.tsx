import { useState, useCallback } from 'react';

const useMediaStream = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Hàm lấy Camera
    const startCamera = useCallback(async (constraints = { video: true, audio: true }) => {
        setLoading(true);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.name + ": " + err.message : "An unknown error occurred");
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
                audio: true
            });
            setStream(screenStream);
            setError(null);
        } catch (err) {
            setError(JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm dừng stream
    const stopStream = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    return { stream, error, loading, startCamera, startScreenShare, stopStream };
};

export default useMediaStream;
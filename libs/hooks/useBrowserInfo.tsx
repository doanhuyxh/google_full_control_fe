import { useState, useEffect } from 'react';
import { useAntdApp } from './useAntdApp';

const useBrowserInfo = () => {
    const { notification } = useAntdApp();
    const initialUserAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
    const [ipAddress, setIpAddress] = useState<string>('');
    const [geoCoordinates, setGeoCoordinates] = useState<{ latitude: number | 0; longitude: number | 0 }>({ latitude: 0, longitude: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGeoData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('https://api.myip.com');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.ip) {
                    setIpAddress(data.ip);
                } else {
                    throw new Error(`MyIP API failed: Invalid response format`);
                }

            } catch (err: any) {
                let message = '';
                const host = window.location.hostname;
                if (host === 'localhost' || host === '127.0.0.1') {
                    message = ' (Lưu ý: Bạn đang ở môi trường localhost, địa chỉ IP có thể không chính xác)';
                    notification.warning({
                        message: 'Cảnh báo IP',
                        description: `Không thể lấy địa chỉ IP từ MyIP API${message}`,
                    });
                    setIpAddress('127.0.0.1');
                } else {
                    notification.error({
                        message: 'Lỗi IP',
                        description: `Không thể lấy địa chỉ IP: ${err.message}`,
                    });
                    setError(`IP Lookup Failed: ${err.message}`);
                }
            }
            if (window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setGeoCoordinates({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (geoError) => {
                        notification.warning({
                            message: 'Lỗi vị trí',
                            description: `Không thể lấy tọa độ vị trí: ${geoError.message}`,
                        });
                    }
                );
            }

            setIsLoading(false);
        };

        // Đảm bảo chỉ chạy ở phía client (trong trình duyệt)
        if (typeof window !== 'undefined') {
            fetchGeoData();
        } else {
            setIsLoading(false);
        }

    }, []); // Dependency rỗng đảm bảo chỉ chạy một lần khi mount

    return {
        userAgent: initialUserAgent,
        ipAddress,
        coordinates: geoCoordinates,
        isLoading,
        error,
    };
};

export default useBrowserInfo;
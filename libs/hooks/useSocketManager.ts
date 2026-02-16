// hooks/useSocketManager.ts
import { useCallback } from 'react';
import { Socket, io } from 'socket.io-client';
import Cookies from 'js-cookie';

let socketInstance: Socket | null = null;

export const useSocketManager = () => {
    // Hàm lấy token từ cookie (Ví dụ cookie tên là 'access_token')
    const getToken = () => localStorage.getItem('token') || Cookies.get('access_token') || '';
    // HÀM KẾT NỐI CHUNG (Duy nhất 1 kết nối)
    const connectSocket = useCallback((rawUrl: string) => {
        const token = getToken();
        console.log('🔗 Attempting to connect socket...', rawUrl);
        if (!token || !rawUrl) return;
        if (socketInstance?.connected) return; // Đã kết nối rồi thì không làm gì cả
        const fullUrl = `${process.env.NEXT_PUBLIC_BACK_END_SOCKET_IO_URL}/${rawUrl}`;
        console.log('🌐 Connecting to Socket.IO server at:', fullUrl);
        // Khởi tạo trực tiếp Socket instance
        socketInstance = io(fullUrl, {
            auth: { token },
            extraHeaders: { Authorization: `Bearer ${token}` },
            withCredentials: true,
            transports: ['websocket'], // Ưu tiên websocket để nhanh và nhẹ nhất
        });

        socketInstance.emit('onConnect', () => {
            console.log('✅ Socket connected:', socketInstance?.id);
        });

        socketInstance.on('connected', (payload) => {
            console.log('✅ Socket connected:', payload);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('❌ Connection Error:', err.message);
        });
    }, []);

    // HÀM NGẮT KẾT NỐI CHUNG
    const disconnectSocket = useCallback(() => {
        if (socketInstance) {
            socketInstance.disconnect();
            socketInstance.removeAllListeners();
            socketInstance = null;
            console.log('🔌 Socket disconnected');
        }
    }, []);

    // Hàm lấy socket instance hiện tại
    const getSocket = () => socketInstance;

    return { connectSocket, disconnectSocket, getSocket };
};
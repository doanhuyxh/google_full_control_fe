import { useSocketManager } from "@/libs/hooks/useSocketManager";
import { initZaloPersonalLoginQr } from "@/libs/network/zalo-personal.api";
import { Modal, Image } from "antd";
import { useEffect, useState } from "react";

interface FormZaloAccountProps {
    isShowModal?: boolean;
    onCloseModal?: () => void;
    zaloId: string | null;
}

export default function FormLoginQr({ isShowModal, onCloseModal, zaloId }: FormZaloAccountProps) {
    const { connectSocket, disconnectSocket, getSocket } = useSocketManager();
    const zaloSocket = getSocket();

    const [formData, setFormData] = useState<{ type: string, data: any, message: string }>({
        type: '', data: null, message: ''
    })

    useEffect(() => {
        if (!zaloId || !isShowModal || !zaloSocket) return;
        initZaloPersonalLoginQr(zaloId, zaloSocket.id || "")
    }, [zaloId, zaloSocket, isShowModal]);

    useEffect(() => {
        if (!zaloSocket) return;
        zaloSocket.on('zaloLogin', (data: any) => {
            console.log('Received data from socket:', data);
            setFormData(data);
        });

    }, [zaloSocket]);

    useEffect(() => {
        connectSocket('zalo')
        return () => {
            disconnectSocket();
        };
    }, [])

    return (
        <Modal
            title="Zalo Login via QR Code"
            open={isShowModal}
            onCancel={onCloseModal}
            footer={null}
        >
            <div className="flex flex-col items-center justify-center">
                {formData.data?.image && (
                    <Image
                        src={`data:image/png;base64,${formData.data.image}`}
                        alt="Zalo QR Code"
                        className="mb-4"
                        preview={false}
                    />
                )}
                {formData.message && (
                    <p className="text-red-500 mb-4">{formData.message}</p>
                )}
                <p className="text-center">Please scan the QR code with your Zalo app to log in.</p>
            </div>
        </Modal>
    );
}
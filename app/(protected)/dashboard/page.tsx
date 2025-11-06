"use client";
import { Button, Space, Card } from "antd";
import { useState } from "react";
import { useModal } from "@/libs/hooks/useModal";
import { CustomModal, InfoModal } from "@/components/common/modal";

export default function DashboardPage() {
    const modal = useModal();
    const [customModalOpen, setCustomModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);

    const handleShowConfirmModal = () => {
        modal.showConfirm({
            title: 'Xác nhận thao tác',
            content: 'Bạn có chắc chắn muốn thực hiện thao tác này không?',
            onOk: () => {
                console.log('Đã xác nhận');
                modal.showSuccess({
                    title: 'Thành công!',
                    content: 'Thao tác đã được thực hiện thành công.'
                });
            },
            onCancel: () => {
                console.log('Đã hủy');
            }
        });
    };

    const handleShowWarningModal = () => {
        modal.showWarning({
            title: 'Cảnh báo',
            content: 'Đây là một thông báo cảnh báo quan trọng!'
        });
    };

    const handleShowErrorModal = () => {
        modal.showError({
            title: 'Lỗi',
            content: 'Có lỗi xảy ra trong quá trình xử lý!'
        });
    };

    const handleShowInfoModal = () => {
        modal.showInfo({
            title: 'Thông tin',
            content: 'Đây là thông tin hữu ích cho bạn.'
        });
    };

    return (
        <div className="p-6">
            <Card title="Dashboard - Demo Modal" className="mb-6">
                <p className="mb-4">Trang này demo các loại modal trong ứng dụng:</p>
                
                <Space wrap>
                    <Button type="primary" onClick={handleShowConfirmModal}>
                        Modal Xác nhận
                    </Button>
                    
                    <Button onClick={handleShowWarningModal}>
                        Modal Cảnh báo
                    </Button>
                    
                    <Button danger onClick={handleShowErrorModal}>
                        Modal Lỗi
                    </Button>
                    
                    <Button type="dashed" onClick={handleShowInfoModal}>
                        Modal Thông tin
                    </Button>
                    
                    <Button onClick={() => setCustomModalOpen(true)}>
                        Custom Modal
                    </Button>
                    
                    <Button onClick={() => setInfoModalOpen(true)}>
                        Info Modal
                    </Button>
                </Space>
            </Card>

            {/* Custom Modal với form */}
            <CustomModal
                open={customModalOpen}
                onCancel={() => setCustomModalOpen(false)}
                title="Custom Modal"
                onOk={() => {
                    console.log('Custom modal OK');
                    setCustomModalOpen(false);
                }}
                width={600}
            >
                <div className="py-4">
                    <p>Đây là custom modal với nội dung tùy chỉnh.</p>
                    <p>Bạn có thể thêm form, table hoặc bất kỳ component nào vào đây.</p>
                </div>
            </CustomModal>

            {/* Info Modal chỉ hiển thị thông tin */}
            <InfoModal
                open={infoModalOpen}
                onCancel={() => setInfoModalOpen(false)}
                title="Thông tin chi tiết"
                width={500}
            >
                <div className="py-4">
                    <h4>Chi tiết thông tin:</h4>
                    <ul className="list-disc ml-6 mt-2">
                        <li>Modal đã được cấu hình với theme tùy chỉnh</li>
                        <li>Hỗ trợ nhiều loại modal khác nhau</li>
                        <li>Có thể tùy chỉnh kích thước, vị trí</li>
                        <li>Tích hợp sẵn với App context của Ant Design</li>
                    </ul>
                </div>
            </InfoModal>
        </div>
    );
}

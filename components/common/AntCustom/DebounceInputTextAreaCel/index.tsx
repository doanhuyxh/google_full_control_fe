import React, { useState, useEffect, useCallback } from 'react';
import { Input, Modal, Button, Tooltip, Space, message } from 'antd';
import { CopyOutlined, FullscreenOutlined } from '@ant-design/icons';

// Giả định hook useDebounce hoạt động tốt như trong code gốc
import { useDebounce } from '@/libs/hooks/useDebounce'; 

interface DebouncedInputTextAreaCellProps {
    initialValue: string;
    recordId: string;
    dataIndex: string;
    onUpdate: (id: string, key: string, value: string) => void;
    // Đã loại bỏ type vì chỉ dùng cho Input.TextArea trong Modal
    isCopy?: boolean;
    // onCopy có thể dùng để thực hiện hành động phụ, nhưng thường chỉ cần logic copy nội bộ
    // onCopy?: (value: string) => void; 
}

const DebouncedInputTextAreaCell: React.FC<DebouncedInputTextAreaCellProps> = ({
    initialValue,
    recordId,
    dataIndex,
    onUpdate,
    isCopy = false,
}) => {
    // Giá trị hiện tại của Input (có thể là Input thường hoặc Input.TextArea trong Modal)
    const [inputValue, setInputValue] = useState(initialValue);
    // Giá trị đã được debounce để gọi onUpdate
    const debouncedValue = useDebounce(inputValue, 1000);
    // Trạng thái hiển thị Modal phóng to
    const [isShowModal, setIsShowModal] = useState(false);
    
    // --- Đồng bộ giá trị khi initialValue thay đổi từ bên ngoài ---
    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);

    // --- Gọi onUpdate khi debouncedValue thay đổi ---
    useEffect(() => {
        // Chỉ cập nhật nếu giá trị đã debounce khác với giá trị ban đầu
        if (debouncedValue !== initialValue) {
            onUpdate(recordId, dataIndex, debouncedValue);
        }
    // Cần có initialValue trong dependency array để đảm bảo so sánh đúng
    }, [debouncedValue, recordId, dataIndex, initialValue, onUpdate]); 

    // --- Xử lý Copy ---
    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(inputValue);
            message.success('Đã sao chép nội dung!');
            // Nếu cần, có thể gọi onCopy ở đây
            // onCopy?.(inputValue);
        } catch (err) {
            message.error('Sao chép thất bại.');
            console.error('Copy failed:', err);
        }
    }, [inputValue]);

    // Component Input thường ở dạng nhỏ (Mặc định)
    const renderSmallInput = (
        <Input
            size="small"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ width: '100%' }}
            // Thêm icon để mở Modal và Copy
            addonAfter={
                <Space size={0}>
                    {/* Nút Phóng to */}
                    <Tooltip title="Phóng to để chỉnh sửa">
                        <FullscreenOutlined 
                            onClick={() => setIsShowModal(true)} 
                            style={{ cursor: 'pointer' }}
                        />
                    </Tooltip>
                    
                    {/* Nút Copy */}
                    {isCopy && (
                        <Tooltip title="Sao chép">
                            <CopyOutlined 
                                onClick={handleCopy} 
                                style={{ cursor: 'pointer', marginLeft: 4 }}
                            />
                        </Tooltip>
                    )}
                </Space>
            }
        />
    );

    // Component Modal phóng to với Input.TextArea
    const renderModal = (
        <Modal
            title={`Chỉnh sửa nội dung: ${dataIndex}`}
            open={isShowModal}
            onCancel={() => setIsShowModal(false)}
            footer={[
                // Nút Copy trong Modal
                isCopy && (
                    <Button key="copy" icon={<CopyOutlined />} onClick={handleCopy}>
                        Sao chép
                    </Button>
                ),
                // Nút Đóng
                <Button key="close" onClick={() => setIsShowModal(false)}>
                    Đóng
                </Button>,
            ]}
            width={800} // Tùy chỉnh kích thước Modal
        >
            <Input.TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoSize={{ minRows: 10, maxRows: 30 }} // Kích thước lớn hơn trong Modal
                style={{ width: '100%' }}
            />
        </Modal>
    );

    return (
        <>
            {renderSmallInput}
            {renderModal}
        </>
    );
}

export default DebouncedInputTextAreaCell;
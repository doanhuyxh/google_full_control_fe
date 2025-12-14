import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

import { useDebounce } from '@/libs/hooks/useDebounce';
interface DebouncedInputProps {
    initialValue: string;
    recordId: string;
    dataIndex: string;
    onUpdate: (id: string, key: string, value: string) => void;
    type?: 'text' | 'number' | 'password';
    isCopy?: boolean;
    onCopy?: (value: string) => void;
}

const DebouncedInputCell: React.FC<DebouncedInputProps> = ({
    initialValue,
    recordId,
    dataIndex,
    onUpdate,
    type = 'text',
    isCopy = false,
    onCopy,
}) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const debouncedValue = useDebounce(inputValue, 1000);
    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);
    useEffect(() => {
        if (debouncedValue !== initialValue) {
            onUpdate(recordId, dataIndex, debouncedValue);
        }
    }, [debouncedValue, recordId, dataIndex, onUpdate, initialValue]);

    switch (type) {
        case 'number':
            return (
                <Input
                    size="small"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ width: '100%' }}
                    type="number"
                />
            );
        case 'password':
            return (
                <Input.Password
                    size="small"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ width: '100%' }}
                    suffix={isCopy ? <CopyOutlined onClick={() => {
                        onCopy && onCopy(inputValue);
                    }} /> : ''}
                />
            );
        case 'text':
        default:
            return (
                <Input
                    size="small"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ width: '100%' }}
                />
            );
    }

};

export default DebouncedInputCell;
import { useDebounce } from "@/libs/hooks/useDebounce";
import { GoogleAccountStatusOptions } from "@/libs/intefaces/googleData";
import { Button, Input, Select, Tooltip } from "antd";
import { MailPlusIcon, PlusCircle, SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";


interface GoogleAccountFilterProps {
    value?: string;
    onSearch: (value: string) => void;
    status?: string;
    setStatus?: (value: string) => void;
    handleFormModal?: () => void;
    handleSendEmailModal?: () => void;
}

export default function GoogleAccountFilter({ onSearch, value, status, setStatus, handleFormModal, handleSendEmailModal }: GoogleAccountFilterProps) {
    const [searchTerm, setSearchTerm] = useState(value || "");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    useEffect(() => {
        onSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, onSearch]);

    return <div className="flex flex-wrap justify-between items-start md:items-center gap-2 mb-5!">
        <Input
            placeholder="Tìm kiếm theo tên, email..."
            className="w-full md:max-w-[300px]"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            size="middle"
        />
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Tooltip title="Tạo mới Google Account">
                <Button className="flex! items-center justify-center" onClick={handleFormModal} size="small" >
                    <PlusCircle size={18} color="red" />
                </Button>
            </Tooltip>
            <Tooltip title="Gửi Email đến các tài khoản Google">
                <Button className="flex! items-center justify-center" size="small" onClick={handleSendEmailModal}>
                    <MailPlusIcon color="white" size={18} />
                </Button>
            </Tooltip>
            <Tooltip title="Cài đặt bảng">
                <Button className="flex! items-center justify-center" size="small">
                    <SettingsIcon color="blue" size={18} />
                </Button>
            </Tooltip>
            <Select placeholder="Lọc theo trạng thái"
                className="full-option min-w-[140px] flex-1 md:flex-none md:min-w-[180px]"
                allowClear
                value={status}
                onChange={setStatus}
                size="small">
                <Select.Option value="">Tất cả</Select.Option>
                {GoogleAccountStatusOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                ))}
            </Select>
        </div>
    </div>
}
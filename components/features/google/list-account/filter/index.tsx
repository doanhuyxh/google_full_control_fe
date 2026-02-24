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
            placeholder="Search by email or name"
            className="w-full md:max-w-[300px]"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            size="middle"
        />
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Tooltip title="Add New Google Account">
                <Button type="primary" icon={<PlusCircle />} onClick={handleFormModal} size="middle" />
            </Tooltip>
            <Tooltip title="Send Email to Email Accounts">
                <Button icon={<MailPlusIcon color="white" />} size="middle" className="bg-green-500! hover:bg-green-600!" onClick={handleSendEmailModal} />
            </Tooltip>
            <Tooltip title="Table Settings">
                <Button icon={<SettingsIcon color="white" />} size="middle" className="bg-yellow-400! hover:bg-yellow-500!" />
            </Tooltip>
            <Select placeholder="Filter by status"
                className="full-option min-w-[140px] flex-1 md:flex-none md:min-w-[180px]"
                allowClear
                value={status}
                onChange={setStatus}
                size="middle">
                <Select.Option value="">Tất cả</Select.Option>
                {GoogleAccountStatusOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                ))}
            </Select>
        </div>
    </div>
}
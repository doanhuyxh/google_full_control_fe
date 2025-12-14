import { useDebounce } from "@/libs/hooks/useDebounce";
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

    return <div className="flex justify-between items-center mb-5!">
        <Input placeholder="Search by email or name" className="max-w-[300px] mb-4" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} />
        <div className="flex gap-2">
            <Tooltip title="Add New Google Account">
                <Button type="primary" icon={<PlusCircle />} onClick={handleFormModal} />
            </Tooltip>
            <Tooltip title="Send Email to Email Accounts">
                <Button icon={<MailPlusIcon color="white" />} className="bg-green-500! hover:bg-green-600!" onClick={handleSendEmailModal} />
            </Tooltip>
            <Tooltip title="Table Settings">
                <Button icon={<SettingsIcon color="white" />} className="bg-yellow-400! hover:bg-yellow-500!" />
            </Tooltip>
            <Select placeholder="Filter by status"
                className="full-option min-w-[180px]"
                allowClear
                value={status}
                onChange={setStatus}>
                <Select.Option value="">All</Select.Option>
                <Select.Option value="live">Active</Select.Option>
                <Select.Option value="suspended">Suspended</Select.Option>
                <Select.Option value="phone_verification">
                    Phone Verification
                </Select.Option>
            </Select>
        </div>
    </div>
}
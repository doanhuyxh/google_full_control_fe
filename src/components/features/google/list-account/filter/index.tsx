import { useDebounce } from "@/libs/hooks/useDebounce";
import { GoogleAccountResourcesUsedOptions, GoogleAccountStatusOptions } from "@/libs/interfaces/googleData";
import { Button, Checkbox, Divider, Input, Popover, Select, Tooltip } from "antd";
import { MailPlusIcon, PlusCircle, SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type ColumnVisibilityOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

interface GoogleAccountFilterProps {
    value?: string;
    resources_used?: string;
    setResourcesUsed?: (value: string) => void;
    onSearch: (value: string) => void;
    status?: string;
    setStatus?: (value: string) => void;
    handleFormModal?: () => void;
    handleSendEmailModal?: () => void;
    columnOptions?: ColumnVisibilityOption[];
    visibleColumns?: string[];
    onVisibleColumnsChange?: (keys: string[]) => void;
}

export default function GoogleAccountFilter({
    onSearch,
    value,
    resources_used,
    setResourcesUsed,
    status,
    setStatus,
    handleFormModal,
    handleSendEmailModal,
    columnOptions = [],
    visibleColumns = [],
    onVisibleColumnsChange,
}: GoogleAccountFilterProps) {
    const [searchTerm, setSearchTerm] = useState(value || "");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    useEffect(() => {
        onSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, onSearch]);

    const toggleAbleOptions = columnOptions.filter((option) => !option.disabled);
    const allToggleAbleKeys = toggleAbleOptions.map((option) => option.value);
    const checkedToggleAbleKeys = visibleColumns.filter((key) => allToggleAbleKeys.includes(key));
    const isAllChecked = allToggleAbleKeys.length > 0 && checkedToggleAbleKeys.length === allToggleAbleKeys.length;
    const isIndeterminate = checkedToggleAbleKeys.length > 0 && !isAllChecked;

    const handleToggleAll = (checked: boolean) => {
        const fixedKeys = columnOptions.filter((option) => option.disabled).map((option) => option.value);
        onVisibleColumnsChange?.(checked ? [...fixedKeys, ...allToggleAbleKeys] : fixedKeys);
    };

    const columnSettingsContent = (
        <div className="min-w-48">
            <Checkbox
                indeterminate={isIndeterminate}
                checked={isAllChecked}
                onChange={(e) => handleToggleAll(e.target.checked)}
            >
                Hiện tất cả
            </Checkbox>
            <Divider className="my-2!" />
            <Checkbox.Group
                className="flex flex-col gap-2"
                options={columnOptions}
                value={visibleColumns}
                onChange={(checked) => onVisibleColumnsChange?.(checked as string[])}
            />
        </div>
    );

    return <div className="flex flex-wrap justify-between items-start md:items-center gap-2 mb-5!">
        <Input
            placeholder="Tìm kiếm theo tên, email..."
            className="max-w-sm"
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
                    <MailPlusIcon size={18} />
                </Button>
            </Tooltip>
            <Popover
                content={columnSettingsContent}
                title="Ẩn / hiện cột"
                trigger="click"
                placement="bottomRight"
            >
                <Tooltip title="Cài đặt bảng">
                    <Button className="flex! items-center justify-center" size="small">
                        <SettingsIcon color="blue" size={18} />
                    </Button>
                </Tooltip>
            </Popover>
            <Select placeholder="Lọc theo tài nguyên sử dụng"
                className="full-option flex-1 md:flex-none min-w-40"
                allowClear
                value={resources_used}
                onChange={setResourcesUsed}
                size="small">
                {GoogleAccountResourcesUsedOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                ))}
            </Select>
            <Select placeholder="Lọc theo trạng thái"
                className="full-option flex-1 md:flex-none min-w-40"
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
import { Input, Select } from "antd";


interface GoogleAccountFilterProps {
    value?: string;
    onSearch: (value: string) => void;
    status?: string;
    setStatus?: (value: string) => void;
}

export default function GoogleAccountFilter({ onSearch, value, status, setStatus }: GoogleAccountFilterProps) {
    return <div className="flex justify-between items-center mb-5!">
        <Input placeholder="Search by email or name" className="max-w-[300px] mb-4" onChange={(e) => onSearch(e.target.value)} value={value} />
        <div className="flex gap-2">
            <Select placeholder="Filter by status" className="w-48" allowClear value={status} onChange={setStatus}>
                <Select.Option value="">All</Select.Option>
                <Select.Option value="live">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
                <Select.Option value="suspended">Suspended</Select.Option>
            </Select>
        </div>
    </div>
}
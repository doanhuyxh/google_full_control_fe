import { useDebounce } from "@/libs/hooks/useDebounce";
import { Button, Input, Tooltip } from "antd";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface TikTokFilterProps {
    value?: string;
    onSearch: (value: string) => void;
    handleFormModal?: () => void;
}

export default function TikTokFilter({ onSearch, value, handleFormModal }: TikTokFilterProps) {
    const [searchTerm, setSearchTerm] = useState(value || "");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        onSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, onSearch]);

    return (
        <div className="flex flex-wrap justify-between items-start md:items-center gap-2 mb-5!">
            <Input
                placeholder="Tìm kiếm theo username, email, số điện thoại..."
                className="w-full md:max-w-[350px]"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                size="middle"
            />
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <Button type="primary" className="flex! items-center justify-center" onClick={handleFormModal} size="small">
                    Tạo tài khoản mới
                </Button>
            </div>
        </div>
    );
}

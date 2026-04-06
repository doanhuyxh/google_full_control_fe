import { useDebounce } from "@/libs/hooks/useDebounce";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";

interface RevidApiFilterProps {
    value?: string;
    onSearch: (value: string) => void;
    handleFormModal?: () => void;
    handleImportModal?: () => void;
    handleLoginActive?: () => void;
    handleApiKeyActive?: () => void;
    handleCreditActive?: () => void;
    handleSyncAllActive?: () => void;
    selectedCount?: number;
    bulkLoading?: boolean;
}

export default function RevidApiFilter({
    onSearch,
    value,
    handleFormModal,
    handleImportModal,
    handleLoginActive,
    handleApiKeyActive,
    handleCreditActive,
    handleSyncAllActive,
    selectedCount = 0,
    bulkLoading = false,
}: RevidApiFilterProps) {
    const [searchTerm, setSearchTerm] = useState(value || "");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        onSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, onSearch]);

    return (
        <div className="flex flex-wrap justify-between items-start md:items-center gap-2 mb-5!">
            <Input
                placeholder="Tìm kiếm theo email, user id, api key..."
                className="w-full md:max-w-96"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                size="middle"
            />
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <Button
                    onClick={handleLoginActive}
                    size="small"
                    loading={bulkLoading}
                    disabled={selectedCount === 0}
                    type="primary"
                >
                    Login ({selectedCount})
                </Button>
                <Button
                    onClick={handleApiKeyActive}
                    size="small"
                    loading={bulkLoading}
                    disabled={selectedCount === 0}
                    type="primary"
                >
                    Lấy API_KEY ({selectedCount})
                </Button>
                <Button
                    onClick={handleCreditActive}
                    size="small"
                    loading={bulkLoading}
                    disabled={selectedCount === 0}
                    type="primary"
                >
                    Lấy Credit({selectedCount})
                </Button>
                <Button
                    onClick={handleSyncAllActive}
                    size="small"
                    loading={bulkLoading}
                    disabled={selectedCount === 0}
                    type="primary"
                >
                    Đồng bộ tất cả ({selectedCount})
                </Button>
                <Button
                    type="primary"
                    className="flex! items-center justify-center"
                    onClick={handleImportModal}
                    size="small"
                >
                    Import
                </Button>
                <Button
                    type="primary"
                    className="flex! items-center justify-center"
                    onClick={handleFormModal}
                    size="small"
                >
                    Tạo tài khoản mới
                </Button>
            </div>
        </div>
    );
}
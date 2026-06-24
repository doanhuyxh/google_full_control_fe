import { Input, Button } from "antd";

interface CloudinaryControlsProps {
    searchCloudinary: string;
    setSearchCloudinary: (search: string) => void;
    onAddClick: () => void;
}

export default function CloudinaryControls({
    searchCloudinary,
    setSearchCloudinary,
    onAddClick,
}: CloudinaryControlsProps) {
    return (
        <div className="flex justify-between gap-2 mb-3">
            <Input
                className="max-w-[200px]"
                placeholder="Tìm kiếm Cloudinary..."
                value={searchCloudinary}
                onChange={(e) => setSearchCloudinary(e.target.value)}
            />
            <div className="flex gap-2">
                <Button type="primary" onClick={onAddClick}>
                    Thêm mới tài khoản
                </Button>
            </div>
        </div>
    );
}
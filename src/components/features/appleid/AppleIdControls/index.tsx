import { Input, Button } from "antd";

interface AppleIdControlsProps {
    searchAppleId: string;
    setSearchAppleId: (search: string) => void;
    onAddClick: () => void;
}

export default function AppleIdControls({
    searchAppleId,
    setSearchAppleId,
    onAddClick,
}: AppleIdControlsProps) {
    return (
        <div className="flex justify-between gap-2 mb-3">
            <Input
                className="max-w-[200px]"
                placeholder="Tìm kiếm Apple ID..."
                value={searchAppleId}
                onChange={(e) => setSearchAppleId(e.target.value)}
            />
            <div className="flex gap-2">
                <Button type="primary" onClick={onAddClick}>
                    Thêm mới tài khoản Apple ID
                </Button>
            </div>
        </div>
    );
}
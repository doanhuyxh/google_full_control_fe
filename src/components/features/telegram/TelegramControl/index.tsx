import { Button, Input } from "antd";

interface TelegramControlProps {
    searchTelegram: string;
    setSearchTelegram: (search: string) => void;
    onAddClick: () => void;
}

export default function TelegramControl({
    searchTelegram,
    setSearchTelegram,
    onAddClick,
}: TelegramControlProps) {
    return (
        <div className="flex justify-between gap-2 mb-3">
            <Input
                className="max-w-[200px]"
                placeholder="Tìm kiếm tài khoản Telegram"
                value={searchTelegram}
                onChange={(e) => setSearchTelegram(e.target.value)}
            />
            <div className="flex gap-2">
                <Button type="primary" onClick={onAddClick}>
                    Thêm mới
                </Button>
            </div>
        </div>
    );
}
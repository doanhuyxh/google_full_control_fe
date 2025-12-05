import { Input, Button } from "antd";

interface ZaloPersonalAccountControlsProps {
    searchZaloPersonal: string;
    setSearchZaloPersonal: (search: string) => void;
    onAddClick: () => void;
}

export default function ZaloPersonalAccountControls({
    searchZaloPersonal,
    setSearchZaloPersonal,
    onAddClick,
}: ZaloPersonalAccountControlsProps) {
    return (
        <div className="flex justify-between gap-2 mb-3">
            <Input
                className="max-w-[200px]"
                placeholder="Search Zalo Personal Accounts"
                value={searchZaloPersonal}
                onChange={(e) => setSearchZaloPersonal(e.target.value)}
            />
            <div className="flex gap-2">
                <Button type="primary" onClick={onAddClick} icon={<span>+</span>}/>                    
            </div>
        </div>
    );
}
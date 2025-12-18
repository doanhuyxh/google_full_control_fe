import DevicesComponent from "@/components/features/devices";
import { Suspense } from "react";

export const metadata = {
    title: "Quản lý thiết bị",
    description: "Quản lý thiết bị",
};

export default function DevicesPage() {
    return <Suspense fallback={<div>Đang tải trang thiết bị...</div>}>
        <DevicesComponent />
    </Suspense>
}
"use client";

import { useEffect, useState } from "react";

export function useDynamicAntdTableScrollHeight(selector: string = ".ant-table-wrapper") {
    const [scrollY, setScrollY] = useState(400);
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            setScrollY(400);
            return;
        }
        const calculateHeight = () => {
            const tableWrapper = document.querySelector(selector) as HTMLElement;
            if (!tableWrapper) return;
            const rect = tableWrapper.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            // Khoảng cách từ đầu bảng đến cuối màn hình
            let availableHeight = viewportHeight - rect.top;
            // Trừ chiều cao pagination nếu có
            const pagination = tableWrapper.querySelector(".ant-table-pagination") as HTMLElement;
            if (pagination) {
                const paginationHeight = pagination.getBoundingClientRect().height;
                availableHeight -= paginationHeight + 16; // +16 để dư padding/margin
            }
            // Trừ thêm khoảng cách bên dưới nếu có padding/margin chung
            availableHeight -= 20;
            // Trừ chiều cao của phân trang nếu có
            availableHeight -= 120; // Giả sử phân trang có chiều cao 120px
            setScrollY(Math.floor(availableHeight));
        };
        setTimeout(calculateHeight, 100);
        window.addEventListener("resize", calculateHeight);
        return () => {
            window.removeEventListener("resize", calculateHeight);
        };
    }, [selector]);

    return scrollY;
}

export default useDynamicAntdTableScrollHeight;
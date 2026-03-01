"use client";

import { useState, useEffect } from "react";

export default function RealTimeClock() {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!now) return null;

    return (
        <span className="text-xs font-mono opacity-70 select-none mr-1">
            {now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
    );
}

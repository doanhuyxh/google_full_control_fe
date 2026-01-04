"use client";

import { Spin } from "antd";
import { useEffect } from "react";
import {logoutApi} from "@/libs/network/auth.api"

export default function LogoutComponent() {

    const logOut = async () => {
        localStorage.clear();
        await logoutApi();
        window.location.href = "/login";
    };

    useEffect(() => {
        logOut();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <Spin size="large" />
        </div>
    );
}

"use client";

import { ReactNode } from "react";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ProtectedLayout from "@/components/layout/Protected";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedLayout>
            <ReduxProvider>
                {children}
            </ReduxProvider>
        </ProtectedLayout>
    )
}
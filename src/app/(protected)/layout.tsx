"use client";

import { ReactNode } from "react";
import ReduxProvider from "@/components/providers/ReduxProvider";
import FirebaseProvider from "@/components/providers/firebase-provider";
import ProtectedLayout from "@/components/layout/Protected";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedLayout>
            <ReduxProvider>
                <FirebaseProvider>
                    {children}
                </FirebaseProvider>
            </ReduxProvider>
        </ProtectedLayout>
    )
}
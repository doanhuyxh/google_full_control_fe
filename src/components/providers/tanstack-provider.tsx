"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";



export default function TanStackProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                refetchOnReconnect: false,
                retry: true,
                retryDelay: 4000,
                staleTime: 1000 * 60 * 5,
            },
        },
    }));
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App, theme as antdTheme } from "antd";
import "@ant-design/v5-patch-for-react-19";
import vi_VN from 'antd/locale/vi_VN';
import { antdComponentConfig } from "@/libs/constants/colors";

type AppTheme = "light" | "dark";

const ThemeContext = createContext<{
    theme: AppTheme;
    setTheme: (theme: AppTheme) => void;
} | null>(null);

export function useAppTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useAppTheme must be used within AntdProvider");
    }

    return context;
}

export default function AntdProvider({ children, initialTheme }: { children: React.ReactNode; initialTheme: AppTheme }) {
    const [theme, setTheme] = useState<AppTheme>(initialTheme);

    useEffect(() => {
        setTheme(initialTheme);
    }, [initialTheme]);

    useEffect(() => {
        const syncThemeFromDom = () => {
            const isDark = document.documentElement.classList.contains("dark");

            setTheme(prev => {
                const next = isDark ? "dark" : "light";

                // tránh update state liên tục
                if (prev === next) return prev;

                return next;
            });
        };

        syncThemeFromDom();

        const observer = new MutationObserver(() => {
            requestAnimationFrame(syncThemeFromDom);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
        <AntdRegistry>
            <ConfigProvider
                locale={vi_VN}
                theme={{
                    algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                    token: {
                        fontFamily: "inherit",
                        ...antdComponentConfig
                    },
                    
                }}
                tooltip={{
                    className: "bg-red-500 rounded-lg text-white px-2 py-1 text-xs",
                }}
            >
                <App
                    message={{
                        top: 80,
                        duration: 3,
                        maxCount: 10,
                    }}
                    notification={{
                        placement: "bottomRight",
                        duration: 3,
                        maxCount: 10,
                        showProgress: true,
                    }}
                >
                    {children}
                </App>
            </ConfigProvider>
        </AntdRegistry>
        </ThemeContext.Provider>
    )
}
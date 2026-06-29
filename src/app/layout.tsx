import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import NextTopLoader from "nextjs-toploader";
import TanStackProvider from "@/components/providers/tanstack-provider";
import AntdProvider from "@/components/providers/antd-provider";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Google Full Control FE",
  description: "A full control front-end for Google services.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color="red" height={5} crawl showSpinner />
        <TanStackProvider>
          <AntdProvider initialTheme={theme as "light" | "dark"}>
            {children}
          </AntdProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}

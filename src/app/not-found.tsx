"use client";

import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                <div className="text-blue-600 text-7xl font-bold mb-4">
                    404
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Không tìm thấy trang 🕵️‍♂️
                </h2>
                <p className="text-gray-500 mb-6">
                    Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
                </p>
                <Link
                    href="/"
                    className="inline-block px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 active:scale-95 transition duration-200"
                >
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
}
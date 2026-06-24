"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-linear-to-br from-red-300 via-red-400 to-red-500 dark:from-red-800 dark:via-red-900 dark:to-black transition-colors duration-300">
            <div className="max-w-md w-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 dark:bg-red-800 p-3 rounded-full shadow-inner">
                        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    Đã xảy ra lỗi 😢
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 px-4">
                    {error.message || "Rất tiếc, đã có sự cố xảy ra."}
                </p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );
}
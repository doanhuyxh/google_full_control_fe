"use client";

interface InfoZaloAccountProps {
    id: string;
}

export default function InfoZaloAccount({ id }: InfoZaloAccountProps) {
    return (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
            <div className="mt-2 text-sm text-gray-600">
                Nội dung thông tin cá nhân của tài khoản: {id}
            </div>
        </section>
    );
}

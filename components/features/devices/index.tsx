"use client";

import { getLoginHistoryApi } from "@/libs/api-client/auth.api";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { LoginHistory } from "@/libs/intefaces/authData";
import { Card, Table } from "antd";
import { useEffect, useState } from "react";

export default function DevicesComponent() {
    const { notification } = useAntdApp();
    const [loading, setLoading] = useState(true);
    const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(20);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [search, setSearch] = useState<string>("");


    const fetchLoginHistory = async () => {
        setLoading(true);
        const response = await getLoginHistoryApi(page, limit, search);
        if (response.status) {
            setLoginHistory(response.data.items || []);
            setTotalItems(response.data.pagination.total);
        } else {
            notification.error({
                message: "Error fetching login history",
                description: response.message || "An unexpected error occurred",
            });
        }
        setLoading(false);
    }

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
        },
        {
            title: "Địa chỉ IP",
            dataIndex: "ipAddress",
            key: "ipAddress",
        }, {
            title: "Tọa độ",
            dataIndex: "coordinates",
            key: "coordinates",
            render: (coordinates: { latitude: number; longitude: number }) =>
                `(${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)})`,
        },
        {
            title: "Trình duyệt",
            dataIndex: "userAgent",
            key: "userAgent",
        }, {
            title: "Thời gian đăng nhập",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) => new Date(createdAt).toLocaleString(),
        }
    ]

    useEffect(() => {
        fetchLoginHistory();
    }, [page, limit, search]);

    return <Card className="p-3 shadow-lg rounded-4xl">
        <div className="flex justify-center items-center">
            <h2 className="text-2xl font-semibold mb-4">Lịch sử đăng nhập</h2>
        </div>
        <Table
            loading={loading}
            dataSource={loginHistory}
            rowKey={(record) => record._id}
            pagination={{
                current: page,
                pageSize: limit,
                total: totalItems,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    setPage(page);
                    setLimit(pageSize || 20);
                },
                showTotal(total, range) {
                    return `Đang hiển thị ${range[0]}-${range[1]} trong tổng số ${total} mục`;
                },
                showLessItems: true,
            }}
            columns={columns}
        />
    </Card>;
}
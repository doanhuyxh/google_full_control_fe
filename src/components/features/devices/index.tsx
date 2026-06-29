"use client";

import useDynamicAntdTableScrollHeight from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import { Card, Table } from "antd";
import { useHistoryLoginHook } from "@/libs/hooks/users/useHistoryLoginHook";
import { useState } from "react";

export default function DevicesComponent() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState("");
    const { data, isLoading } = useHistoryLoginHook(page, limit, search);

   

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
            width: 80,
        },
        {
            title: "Địa chỉ IP",
            dataIndex: "ipAddress",
            key: "ipAddress",
            width: 150,
        }, {
            title: "Tọa độ",
            dataIndex: "coordinates",
            key: "coordinates",
            render: (coordinates: { latitude: string; longitude: string }) =>
                `(${coordinates?.latitude}, ${coordinates?.longitude})`,
            width: 200,
        },
        {
            title: "Trình duyệt",
            dataIndex: "userAgent",
            key: "userAgent",
            width: 300,
        }, {
            title: "Thời gian đăng nhập",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) => new Date(createdAt).toLocaleString(),
            width: 200,
        }
    ]


    return <Card className="shadow-lg rounded-2xl md:rounded-4xl">
        <div className="flex justify-center items-center px-1">
            <h2 className="text-lg md:text-2xl font-semibold mb-4 text-center">Lịch sử đăng nhập</h2>
        </div>
        <Table
            loading={isLoading}
            dataSource={data?.data?.items || []}
            rowKey={(record) => record._id}
            size="small"
            pagination={{
                current: page,
                pageSize: limit,
                total: data?.data?.pagination?.total || 0,
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
            scroll={{
                x: 980,
                y:useDynamicAntdTableScrollHeight()
            }}
            columns={columns}
        />
    </Card>;
}
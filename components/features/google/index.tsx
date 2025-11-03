"use client";

import { useEffect } from "react";
import { Table, Avatar, Button } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { useGoogleAccount } from "@/libs/hooks/users/googleAccoutHook";
import { useToolsDataBackEnd } from "@/libs/hooks/useToolsDataBackEnd";
import { useCommon } from "@/libs/hooks/useCommon";
import { useDynamicAntdTableScrollHeight } from "@/libs/hooks/useDynamicAntdTableScrollHeight";
import GoogleAccountFilter from "./filter";

export default function GoogleAccountComponent() {
    const {
        accountData,
        loadingGoogle,
        fetchGoogleAccounts,
        pageGoogle,
        setPageGoogle,
        limitGoogle,
        setLimitGoogle,
        statusGoogle,
        setStatusGoogle,
        searchGoogle,
        setSearchGoogle,
        totalItemsGoogle,
    } = useGoogleAccount();

    const { decodeData } =  useToolsDataBackEnd();
    const { copiedToClipboard } = useCommon();

    const handleViewPassword = async (encodedPassword: string) => {
        const decoded = await decodeData(encodedPassword);
        await copiedToClipboard(decoded);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_: any, __: any, index: number) => (pageGoogle - 1) * limitGoogle + index + 1,
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar: string) => <Avatar src={avatar || 'https://via.placeholder.com/150'} alt="Avatar" size={50} />,
        },
        {
            title: 'fullName',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (fullName: string) => <span>{fullName}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },

        {
            title: 'PhoneNumber',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'currentPassword',
            dataIndex: 'currentPassword',
            key: 'currentPassword',
            render: (currentPassword: string) => <span>
                <EyeFilled style={{ cursor: 'pointer', marginRight: 8 }} onClick={() => handleViewPassword(currentPassword)} />
            </span>,
        },
        {
            title: 'appPassword',
            dataIndex: 'appPassword',
            key: 'appPassword',
            render: (appPassword: string) => <span>{appPassword}</span>,
        },
        {
            title: 'privateCode',
            dataIndex: 'privateCode',
            key: 'privateCode',
            render: (privateCode: string) => <span>{privateCode}</span>,
        },
        {
            title: 'recoveryEmail',
            dataIndex: 'recoveryEmail',
            key: 'recoveryEmail',
            render: (recoveryEmail: string) => <span>{recoveryEmail}</span>,
        },
        {
            title: 'recoveryPhoneNumber',
            dataIndex: 'recoveryPhoneNumber',
            key: 'recoveryPhoneNumber',
            render: (recoveryPhoneNumber: string) => <span>{recoveryPhoneNumber}</span>,
        },
        {
            title: 'F2A',
            dataIndex: 'f2a',
            key: 'f2a',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: Date) => <span>{new Date(createdAt).toLocaleString()}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <span>
                    <Button type="primary" danger>Delete</Button>
                </span>
            ),
        }
    ]


    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
            <GoogleAccountFilter
                value={searchGoogle}
                onSearch={setSearchGoogle}
                status={statusGoogle}
                setStatus={setStatusGoogle} />
            <Table
                columns={columns}
                dataSource={accountData}
                loading={loadingGoogle}
                rowKey="_id"
                pagination={{
                    current: pageGoogle,
                    pageSize: limitGoogle,
                    total: totalItemsGoogle,
                    onChange: (page, pageSize) => {
                        setPageGoogle(page);
                        setLimitGoogle(pageSize);
                    },
                }}
                scroll={{
                    x:"max-content",
                    y:useDynamicAntdTableScrollHeight()
                }}
            />
        </div>
    )
}
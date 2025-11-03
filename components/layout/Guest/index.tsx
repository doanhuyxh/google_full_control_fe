"use client";
import NextTopLoader from 'nextjs-toploader'
import { ReactNode, Suspense } from 'react';
import {
    ConfigProvider,
    Layout,
    App,
    message,
    notification,
    Spin,
} from 'antd';
import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import antdConfig from '@/libs/constants/antd_config';

export default function AntdLayout({ children }: { children: ReactNode }) {
    message.config({
        top: 80,
        duration: 3,
        maxCount: 3,
    });

    notification.config({
        placement: "topRight",
        duration: 4,
        maxCount: 3,
    });

    return (
        <>
            <NextTopLoader
                color="#29d"
                initialPosition={0.08}
                crawlSpeed={200}
                height={5}
                crawl={true}
                showSpinner={true}
                easing="ease"
                speed={200}
            />
            <AntdRegistry>
                <ConfigProvider theme={antdConfig}>
                    <Layout style={{ minHeight: '100vh' }}>
                        <Layout style={{ flexDirection: 'column' }}>
                            <App>
                                <Suspense fallback={<Spin size="large" className="m-20" />}>
                                    <Layout.Content>
                                        {children}
                                    </Layout.Content>
                                </Suspense>
                            </App>
                        </Layout>
                    </Layout>
                </ConfigProvider>
            </AntdRegistry>
        </>
    );

}
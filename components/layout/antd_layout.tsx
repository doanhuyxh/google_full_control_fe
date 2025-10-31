"use client";

import { ReactNode, useRef, Suspense } from 'react';
import {
    FloatButton,
    Layout
} from 'antd';
import useLocalStorage from '@/libs/hooks/useLocalStorage';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import SideNav from './SideNav';
import HeaderNav from './header';

export default function AntdLayout({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useLocalStorage<boolean>('collapsed', false);
    const floatBtnRef = useRef(null);



    return (
        <AntdRegistry>
            <Layout>
                <SideNav
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value: boolean) => setCollapsed(value)}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        background: 'transparent',
                        border: 'none',
                        transition: 'all .2s',
                    }}
                />
                <Layout>
                    <Suspense fallback={<div>Loading Header...</div>}>
                        <HeaderNav />
                    </Suspense>
                    <div
                        className='p-3 rounded-t-3xl mx-4'
                    >
                        {children}
                        <div ref={floatBtnRef}>
                            <FloatButton.BackTop />
                        </div>
                    </div>
                </Layout>
            </Layout>
        </AntdRegistry>
    );
}
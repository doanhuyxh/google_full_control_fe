'use client';

import { useEffect, useRef, useState } from 'react';
import { ConfigProvider, Layout, Menu } from 'antd';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { COLOR } from '@/libs/contance/colors';
import { menuItems, rootSubmenuKeys } from './menuItems';

const { Sider } = Layout;

const SideNav = ({ ...others }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [current, setCurrent] = useState<string>('');

    const onClick = (e: any) => setCurrent(e.key);

    const onOpenChange = (keys: string[]) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };


    useEffect(() => {
        const paths = pathname.split('/').filter(Boolean);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpenKeys(paths.length > 0 ? [paths[0]] : []);
        setCurrent(paths[paths.length - 1] || '');
    }, [pathname]);


    return (
        <Sider ref={nodeRef} breakpoint="lg" collapsedWidth="0" {...others}>
            <Logo
                color="blue"
                asLink
                href="/"
                justify="center"
                gap="small"
                imgSize={{ h: 28, w: 28 }}
                style={{ padding: '1rem 0' }}
            />
            <ConfigProvider
                theme={{
                    components: {
                        Menu: {
                            itemBg: 'none',
                            itemSelectedBg: COLOR['100'],
                            itemHoverBg: COLOR['50'],
                            itemSelectedColor: COLOR['600'],
                        },
                    },
                }}
            >
                <Menu
                    mode="inline"
                    items={menuItems}
                    onClick={onClick}
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    selectedKeys={[current]}
                />
            </ConfigProvider>
        </Sider>
    );
};

export default SideNav;

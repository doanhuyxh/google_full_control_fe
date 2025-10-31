"use client"

import {
    Button,
    Dropdown,
    Flex,
    Input,
    Layout,
    MenuProps,
    message,
    theme,
    Tooltip,
    Switch,
} from 'antd';
import {
    AppstoreOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MessageOutlined,
    QuestionOutlined,
    SettingOutlined,
    UserOutlined,
    MoonOutlined,
    SunOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import useLocalStorage from '@/libs/hooks/useLocalStorage';

const { Header } = Layout;


const HeaderNav = () => {
    const isMobile = false; // Replace with actual media query if needed
    const [collapsed, setCollapsed] = useLocalStorage<boolean>('collapsed', true);
    const { token: { borderRadius } } = theme.useToken();
    const items: MenuProps['items'] = [
        {
            key: 'user-profile-link',
            label: 'profile',
            icon: <UserOutlined />,
        },
        {
            key: 'user-settings-link',
            label: 'settings',
            icon: <SettingOutlined />,
        },
        {
            key: 'user-help-link',
            label: 'help center',
            icon: <QuestionOutlined />,
        },
        {
            type: 'divider',
        },
        {
            key: 'user-logout-link',
            label: 'logout',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => {
                message.open({
                    type: 'loading',
                    content: 'signing you out',
                });
            },
        },
    ];

    return <Header
        style={{
            marginLeft: 0,
            padding: '0 2rem 0 0',
            background: 'rgba(255, 255, 255, .5)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 8px 2px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            gap: 8,
            transition: 'all .25s',
        }}>
        <Flex align="center">
            <Tooltip title={`${collapsed ? 'Expand' : 'Collapse'} Sidebar`}>
                <Button
                    type="text"
                    icon={
                        collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
            </Tooltip>
            <Input.Search
                placeholder="search"
                style={{
                    width: isMobile ? '100%' : '400px',
                    marginLeft: isMobile ? 0 : '.5rem',
                }}
                size="middle"
            />
        </Flex>
        <Flex align="center" gap="small">
            <Tooltip title="Apps">
                <Button icon={<AppstoreOutlined />} type="text" size="large" />
            </Tooltip>
            <Tooltip title="Messages">
                <Button icon={<MessageOutlined />} type="text" size="large" />
            </Tooltip>
            <Tooltip title="Theme">
                <Switch
                    className=" hidden sm:inline py-1"
                    checkedChildren={<MoonOutlined />}
                    unCheckedChildren={<SunOutlined />}
                    defaultChecked={false}
                />
            </Tooltip>
            <Dropdown menu={{ items }} trigger={['click']}>
                <Flex>
                    <Image
                        src="/me.jpg"
                        alt="user profile photo"
                        height={36}
                        width={36}
                        style={{ borderRadius, objectFit: 'cover' }}
                    />
                </Flex>
            </Dropdown>
        </Flex>

    </Header>;
};

export default HeaderNav;
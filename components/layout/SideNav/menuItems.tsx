import React from 'react';
import Link from 'next/link';
import {
    AppstoreAddOutlined,
    BranchesOutlined,
    BugOutlined,
    GithubOutlined,
    IdcardOutlined,
    InfoCircleOutlined,
    PieChartOutlined,
    ProductOutlined,
    SecurityScanOutlined,
    SnippetsOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
): MenuItem => ({ key, icon, children, label, type } as MenuItem);

export const menuItems: MenuProps['items'] = [
    getItem('Dashboards', 'dashboards', <PieChartOutlined />, [
        getItem(<Link href="/dashboard/default">Default</Link>, 'default'),
        getItem(<Link href="/dashboard/projects">Projects</Link>, 'projects'),
        getItem(<Link href="/dashboard/ecommerce">eCommerce</Link>, 'ecommerce'),
        getItem(<Link href="/dashboard/marketing">Marketing</Link>, 'marketing'),
        getItem(<Link href="/dashboard/social">Social</Link>, 'social'),
        getItem(<Link href="/dashboard/bidding">Bidding</Link>, 'bidding'),
        getItem(<Link href="/dashboard/learning">Learning</Link>, 'learning'),
        getItem(<Link href="/dashboard/logistics">Logistics</Link>, 'logistics'),
    ]),

    getItem(<Link href="/about">About</Link>, 'about', <InfoCircleOutlined />),
    getItem(<Link href="/sitemap">Sitemap</Link>, 'sitemap', <BranchesOutlined />),

    getItem('Pages', 'pages', null, [], 'group'),

    getItem('Corporate', 'corporate', <IdcardOutlined />, [
        getItem(<Link href="/corporate/about">About</Link>, 'about-corp'),
        getItem(<Link href="/corporate/team">Team</Link>, 'team'),
        getItem(<Link href="/corporate/faqs">FAQ</Link>, 'faqs'),
        getItem(<Link href="/corporate/contact">Contact us</Link>, 'contact'),
        getItem(<Link href="/corporate/pricing">Pricing</Link>, 'pricing'),
        getItem(<Link href="/corporate/license">License</Link>, 'license'),
    ]),

    getItem('User profile', 'user-profile', <UserOutlined />, [
        getItem(<Link href="/user/details">Details</Link>, 'details'),
        getItem(<Link href="/user/preferences">Preferences</Link>, 'preferences'),
        getItem(<Link href="/user/info">Information</Link>, 'personal-information'),
        getItem(<Link href="/user/security">Security</Link>, 'security'),
        getItem(<Link href="/user/activity">Activity</Link>, 'activity'),
        getItem(<Link href="/user/actions">Actions</Link>, 'actions'),
        getItem(<Link href="/user/help">Help</Link>, 'help'),
        getItem(<Link href="/user/feedback">Feedback</Link>, 'feedback'),
    ]),

    getItem('Authentication', 'authentication', <SecurityScanOutlined />, [
        getItem(<Link href="/auth/signin">Sign In</Link>, 'auth-signin'),
        getItem(<Link href="/auth/signup">Sign Up</Link>, 'auth-signup'),
        getItem(<Link href="/auth/welcome">Welcome</Link>, 'auth-welcome'),
        getItem(<Link href="/auth/verify-email">Verify Email</Link>, 'auth-verify'),
        getItem(<Link href="/auth/password-reset">Password Reset</Link>, 'auth-password-reset'),
        getItem(<Link href="/auth/account-delete">Account Deleted</Link>, 'auth-account-delete'),
    ]),

    getItem('Errors', 'errors', <BugOutlined />, [
        getItem(<Link href="/error/400">400</Link>, '400'),
        getItem(<Link href="/error/403">403</Link>, '403'),
        getItem(<Link href="/error/404">404</Link>, '404'),
        getItem(<Link href="/error/500">500</Link>, '500'),
        getItem(<Link href="/error/503">503</Link>, '503'),
    ]),

    getItem('Help', 'help', null, [], 'group'),
    getItem(
        <Link href="https://docs.example.com/roadmap" target="_blank">Roadmap</Link>,
        'product-roadmap',
        <ProductOutlined />
    ),
    getItem(
        <Link href="https://docs.example.com/components" target="_blank">Components</Link>,
        'components',
        <AppstoreAddOutlined />
    ),
    getItem(
        <Link href="https://docs.example.com/help" target="_blank">Documentation</Link>,
        'documentation',
        <SnippetsOutlined />
    ),
    getItem(
        <Link href="https://github.com/your-repo" target="_blank">Give us a star</Link>,
        'give-us-a-star',
        <GithubOutlined />
    ),
];

export const rootSubmenuKeys = ['dashboards', 'corporate', 'user-profile'];

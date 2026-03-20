
export const metadata = {
    title: 'Information - User Profile',
    description: 'Trang quản lý thông tin cá nhân và API key của người dùng.',
};

import ProfileComponent from '@/components/features/profile';

export default function SettingsPage() {
    return <ProfileComponent />;
}
export const metadata = {
    title: 'Dashboard - Modal Demo',
    description: 'Trang demo các loại modal trong ứng dụng.'
};

import DashboardPage from '@/components/features/dashboard';
import { Suspense } from 'react';

export default function Page() {
    return <Suspense fallback={<div>Loading...</div>}>
        <DashboardPage />
    </Suspense>
}
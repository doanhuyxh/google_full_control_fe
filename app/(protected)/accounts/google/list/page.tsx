import GoogleAccountComponent from '@/components/features/google/list-account';
import { Suspense } from 'react';


export const metadata = {
    title: 'Google Admin Page',
    description: 'Admin page for managing Google accounts and settings.',
};

export default function GooglePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GoogleAccountComponent />
        </Suspense>
    )

}
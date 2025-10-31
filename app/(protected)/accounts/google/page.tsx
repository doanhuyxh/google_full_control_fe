import { Suspense } from 'react';


export const metadata = {
    title: 'Google Admin Page',
    description: 'Admin page for managing Google accounts and settings.',
};

export default function GooglePage() {
    return (
        <Suspense fallback={<div>Loading Google Account Management...</div>}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Google Account Management</h1>
                {/* Google account management components go here */}
            </div>
        </Suspense>
    )

}
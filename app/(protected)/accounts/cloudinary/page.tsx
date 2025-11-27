import { Suspense } from 'react';

export const metadata = {
    title: 'Cloudinary Admin Page',
    description: 'Admin page for managing GitHub accounts and settings.',
};

export default function CloudinaryPage() {
    return (
        <Suspense fallback={<div>Loading Cloudinary Account Management...</div>}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Cloudinary Account Management</h1>
                {/* GitHub account management components go here */}
            </div>
        </Suspense>
    )
}
import { Suspense } from 'react';
import CloudinaryComponent from '@/components/features/cloudinary';

export const metadata = {
    title: 'Cloudinary Admin Page',
    description: 'Admin page for managing Cloudinary accounts and settings.',
};

export default function CloudinaryPage() {
    return (
        <Suspense fallback={<div>Loading Cloudinary Account Management...</div>}>
           <CloudinaryComponent />
        </Suspense>
    )
}
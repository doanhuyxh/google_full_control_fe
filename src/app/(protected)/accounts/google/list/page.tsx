"use client";
import { Suspense } from 'react';
import GoogleAccountComponent from '@/components/features/google/list-account';


export default function GooglePage() {
    return <Suspense fallback={<div>Loading...</div>}>
        <GoogleAccountComponent />
    </Suspense>

}
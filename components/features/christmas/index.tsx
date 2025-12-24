import {Suspense} from 'react';
import ChristmasScene from './ChristmasScene';

export default function ChristmasPage() {
    return (
        <main className="w-full h-screen">
            <Suspense fallback={<div>Loading...</div>}>
                <ChristmasScene />
            </Suspense>
        </main>
    );
}
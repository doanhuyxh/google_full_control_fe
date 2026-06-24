import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const response = new NextResponse();
    for (const cookie of allCookies) {
        response.cookies.set({
            name: cookie.name,
            value: '',
            path: '/',
            maxAge: 0,
        });
    }
    return response;
}
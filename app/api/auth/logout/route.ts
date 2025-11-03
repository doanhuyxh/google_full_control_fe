import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const response = NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_API_BASE_URL + `/login`, request.url));
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
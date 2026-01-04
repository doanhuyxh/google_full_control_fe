
export async function GET() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_BASE_URL}/api/webhook/health-tracking`, {
        method: 'GET',
    });
    if (response.ok) {
        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } else {
        return new Response('Failed to trigger health tracking webhook.', { status: 200 });
    }
}
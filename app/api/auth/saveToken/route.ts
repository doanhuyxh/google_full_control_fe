
export async function POST(req: Request) {
    const { token } = await req.json();
    const response = new Response(JSON.stringify({ message: 'Token saved successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
    response.headers.append('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict`);
    return response;
}
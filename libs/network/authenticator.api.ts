import { AuthenticatorData } from "@/libs/intefaces/authenticatorData";

export async function getAuthenticatorData(code: string): Promise<AuthenticatorData[]> {
    const res = await fetch("https://otpauth-migrate.onrender.com/parse-authentication-google", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
    });
    if (!res.ok) {
        throw new Error("Failed to fetch authenticator data");
    }
    return res.json();
}
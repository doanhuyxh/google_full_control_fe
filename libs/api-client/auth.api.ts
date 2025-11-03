import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import ApiResponse from "../intefaces/apiResponseData";
import { AuthResponse } from "../intefaces/authData";

export async function loginApi(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return await fetcherBackEnd<ApiResponse<AuthResponse>>("/api/auth/login", {
        method: "POST",
        body: { email, password },
    });
}

export async function saveTokenApi(token: string) {
    return await fetch("/api/auth/saveToken", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function logoutApi() {
    return await fetch("/api/auth/logout", {
        method: "POST",
    });
}

export async function registerApi(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
) {
    return await fetcherBackEnd("/auth/register", {
        method: "POST",
        body: { name, email, password, confirmPassword },
    });
}

export async function getProfileApi() {
    return await fetcherBackEnd("/auth/me", {
        method: "GET",
    });
}
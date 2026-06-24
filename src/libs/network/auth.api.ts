import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import ApiResponse from "../intefaces/apiResponseData";
import { AuthResponse, LoginHistoryResponse, UserProfile } from "../intefaces/authData";

export async function loginApi(email: string, password: string, ipAddress: string, userAgent: string, coordinates: { latitude: number; longitude: number }): Promise<ApiResponse<AuthResponse>> {
    return await fetcherBackEnd<ApiResponse<AuthResponse>>("/api/auth/login", {
        method: "POST",
        body: { email, password, ipAddress, userAgent, coordinates },
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

export async function getMeApi() {
    return await fetcherBackEnd("/auth/me", {
        method: "GET",
    });
}

export async function getProfileApi(): Promise<ApiResponse<UserProfile>> {
    return await fetcherBackEnd<ApiResponse<UserProfile>>("/api/user/profile",{
        method:"GET"
    })
}

export async function updateApiKeyApi(): Promise<ApiResponse<{ apiKey: string }>> {
    return await fetcherBackEnd<ApiResponse<{ apiKey: string }>>("/api/user/update-api-key", {
        method: "POST",
    });
}

export function getLoginHistoryApi(page: number, limit: number, search: string) {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (search) {
        queryParams.append("search", search);
    }
    const queryString = queryParams.toString();
    return fetcherBackEnd<ApiResponse<LoginHistoryResponse>>(`/api/auth/login-history?${queryString}`, {
        method: "GET",
    });
}
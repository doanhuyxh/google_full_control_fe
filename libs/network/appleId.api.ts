import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import AppleIdData from "@/libs/intefaces/appleIdData";
import ApiResponse, { PaginatedResponse } from "../intefaces/apiResponseData";

export async function getAppleIDAccounts(page: number, limit: number, search: string): Promise<ApiResponse<PaginatedResponse<AppleIdData>>> {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search,
    });
    return fetcherBackEnd<ApiResponse<PaginatedResponse<AppleIdData>>>(`/api/appleid?${queryParams.toString()}`, {
        method: 'GET',
    });
}

export async function deleteAppleIDAccount(id: string): Promise<ApiResponse<null>> {
    return fetcherBackEnd<ApiResponse<null>>(`/api/appleid/${id}`, {
        method: 'DELETE',
    });
}

export async function createAppleIDAccount(data: Partial<AppleIdData>): Promise<ApiResponse<AppleIdData>> {
    return fetcherBackEnd<ApiResponse<AppleIdData>>('/api/appleid', {
        method: 'POST',
        body: data,
    });
}

export async function updateAppleIDAccount(id: string, data: Partial<AppleIdData>): Promise<ApiResponse<AppleIdData>> {
    return fetcherBackEnd<ApiResponse<AppleIdData>>(`/api/appleid/${id}`, {
        method: 'PATCH',
        body: data,
    });
}

export async function getAppleIDAccountById(id: string): Promise<ApiResponse<AppleIdData>> {
    return fetcherBackEnd<ApiResponse<AppleIdData>>(`/api/appleid/${id}`, {
        method: 'GET',
    });
}
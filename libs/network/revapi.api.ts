import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import RevapiData, { FormRevapiData } from "../intefaces/revapiData";
import ApiResponse, { PaginatedResponse } from "../intefaces/apiResponseData";


export async function getRevapiData(page: number, limit: number, search: string): Promise<ApiResponse<PaginatedResponse<RevapiData>>> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (search) queryParams.append("search", search);

    return await fetcherBackEnd<ApiResponse<PaginatedResponse<RevapiData>>>(`/api/revidapi?${queryParams.toString()}`, {
        method: "GET",
    });
}

export async function createRevapiData(data: FormRevapiData): Promise<ApiResponse<RevapiData>> {
    return await fetcherBackEnd<ApiResponse<RevapiData>>(`/api/revidapi`, {
        method: "POST",
        body: data,
    });
}

export async function updateRevapiData(id: string, data: FormRevapiData): Promise<ApiResponse<RevapiData>> {
    return await fetcherBackEnd<ApiResponse<RevapiData>>(`/api/revidapi/${id}`, {
        method: "PUT",
        body: data,
    });
}

export async function deleteRevapiData(id: string): Promise<ApiResponse<any>> {
    return await fetcherBackEnd<ApiResponse<null>>(`/api/revidapi/${id}`, {
        method: "DELETE",
    });
}

export async function loginRevapiData(id: string): Promise<ApiResponse<RevapiData>> {
    return await fetcherBackEnd<ApiResponse<RevapiData>>(`/api/revidapi/${id}/login`, {
        method: "POST",
    });
}

export async function getApiKeyInfo(id: string): Promise<ApiResponse<RevapiData>> {
    return await fetcherBackEnd<ApiResponse<RevapiData>>(`/api/revidapi/${id}/get-api-key-info`, {
        method: "POST",
    });
}

export async function getUpdateCredit(id: string): Promise<ApiResponse<RevapiData>> {
    return await fetcherBackEnd<ApiResponse<RevapiData>>(`/api/revidapi/${id}/get-update-credit`, {
        method: "POST",
    });
}
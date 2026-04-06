import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import RevapiData, { FormRevapiData } from "../intefaces/revapiData";
import ApiResponse, { PaginatedResponse } from "../intefaces/apiResponseData";


export async function getRevapiData(page: number, limit: number, search: string): Promise<PaginatedResponse<RevapiData>> {
    return await fetcherBackEnd(`/api/revidapi?page=${page}&limit=${limit}&search=${search}`);
}

export async function createRevapiData(data: FormRevapiData): Promise<ApiResponse<RevapiData>> {
    return await fetcherBackEnd(`/api/revidapi`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateRevapiData(id: string, data: FormRevapiData): Promise<ApiResponse<RevapiData>> {
    return await fetcherBackEnd(`/api/revidapi/${id}`, {
        method: 'PUT',
        body: data
    });
}

export async function deleteRevapiData(id: string): Promise<ApiResponse<any>> {
    return await fetcherBackEnd(`/api/revidapi/${id}`, {
        method: 'DELETE',
    });
}

export async function getApiKeyInfo(id: string): Promise<ApiResponse<RevapiData>> {
    return await fetcherBackEnd(`/api/revidapi/${id}/get-api-key-info`, {
        method: 'POST',
    });
}

export async function getUpdateCredit(id: string): Promise<ApiResponse<RevapiData>> {
    return await fetcherBackEnd(`/api/revidapi/${id}/get-update-credit`, {
        method: 'POST',
    });
}
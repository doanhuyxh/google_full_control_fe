import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import ApiResponse, { PaginatedResponse } from "../intefaces/apiResponseData";
import TikTokAccountData, { FormTikTokAccountData } from "../intefaces/tiktokData";


export async function getTikTokAccount(page: number, limit: number, search: string): Promise<ApiResponse<PaginatedResponse<TikTokAccountData>>> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (search) queryParams.append("search", search);
    return await fetcherBackEnd<ApiResponse<PaginatedResponse<TikTokAccountData>>>(`/api/tiktok?${queryParams.toString()}`, {
        method: "GET",
    })
}

export async function addTikTokAccount(formData: FormTikTokAccountData): Promise<ApiResponse<TikTokAccountData>> {
    return await fetcherBackEnd<ApiResponse<TikTokAccountData>>(`/api/tiktok`, {
        method: "POST",
        body:formData,
    })
}

export async function deleteTikTokAccount(id: string): Promise<ApiResponse<null>> {
    return await fetcherBackEnd<ApiResponse<null>>(`/api/tiktok/${id}`, {
        method: "DELETE",
    })
}

export async function updateTikTokAccount(id: string, formData: FormTikTokAccountData): Promise<ApiResponse<TikTokAccountData>> {
    return await fetcherBackEnd<ApiResponse<TikTokAccountData>>(`/api/tiktok/${id}`, {
        method: "PUT",
        body: formData,
    })
}
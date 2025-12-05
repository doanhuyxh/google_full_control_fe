import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import ApiResponse, { PaginatedResponse } from "@/libs/intefaces/apiResponseData";
import ZaloPersonalData, { ZaloPersonalDataFormData, ZaloPersonalDataUpdateData } from "@/libs/intefaces/zaloPersonalData";

export async function getZaloPersonalAccount(page: number, limit: number, search: string): Promise<ApiResponse<PaginatedResponse<ZaloPersonalData>>> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (search) queryParams.append("search", search);
    return await fetcherBackEnd<ApiResponse<PaginatedResponse<ZaloPersonalData>>>(`/api/zalo-personal?${queryParams.toString()}`, {
        method: "GET",
    })
}

export async function deleteZaloPersonalAccount(id: string): Promise<ApiResponse<null>> {
    return await fetcherBackEnd<ApiResponse<null>>(`/api/zalo-personal/${id}`, {
        method: "DELETE",
    })
}

export async function createZaloPersonalAccount(data: ZaloPersonalDataFormData): Promise<ApiResponse<ZaloPersonalData>> {
    return await fetcherBackEnd<ApiResponse<ZaloPersonalData>>(`/api/zalo-personal`, {
        method: "POST",
        body: {
            ...data
        },
    })
}

export async function updateZaloPersonalAccount(id: string, formUpdate:ZaloPersonalDataUpdateData): Promise<ApiResponse<ZaloPersonalData>> {
    return await fetcherBackEnd<ApiResponse<ZaloPersonalData>>(`/api/zalo-personal/${id}`, {
        method: "PUT",
        body: {
            ...formUpdate
        },
    })
}
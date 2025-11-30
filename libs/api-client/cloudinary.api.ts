import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import ApiResponse from "@/libs/intefaces/apiResponseData";
import { CloudinaryData, CloudinaryDataFormData, CloudinaryDataResponse } from "@/libs/intefaces/cloudinaryData";

export async function getAccountCloudinary(page: number, limit: number, search: string): Promise<ApiResponse<CloudinaryDataResponse>> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (search) queryParams.append("search", search);
    return await fetcherBackEnd<ApiResponse<CloudinaryDataResponse>>(`/api/cloudinary?${queryParams.toString()}`, {
        method: "GET",
    })
}

export async function deleteCloudinaryAccount(id: string): Promise<ApiResponse<any>> {
    return await fetcherBackEnd<ApiResponse<any>>(`/api/cloudinary/${id}`, {
        method: "DELETE",
    })
}

export async function createCloudinaryAccount(data: CloudinaryDataFormData): Promise<ApiResponse<CloudinaryData>> {
    return await fetcherBackEnd<ApiResponse<CloudinaryData>>(`/api/cloudinary`, {
        method: "POST",
        body: {
            ...data
        },
    })
}

export async function updateCloudinaryAccount(id: string, data: CloudinaryDataFormData): Promise<ApiResponse<null>> {
    return await fetcherBackEnd<ApiResponse<null>>(`/api/cloudinary/${id}`, {
        method: "PATCH",
        body: {
            ...data
        },
    })
}

export async function getCloudinaryUsage(id: string): Promise<ApiResponse<any>> {
    return await fetcherBackEnd<ApiResponse<any>>(`/api/cloudinary/${id}/usage-quota`, {
        method: "GET",
    })
}
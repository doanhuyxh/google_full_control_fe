import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import ApiResponse, { PaginatedResponse } from "../intefaces/apiResponseData";
import { GoogleAccount, GoogleAccountCreateData } from "../intefaces/googleData";

export async function getGoogleAccount(page: number, limit: number, status: string, search: string): Promise<ApiResponse<PaginatedResponse<GoogleAccount>>> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (status) queryParams.append("status", status);
    if (search) queryParams.append("search", search);
    return await fetcherBackEnd<ApiResponse<PaginatedResponse<GoogleAccount>>>(`/api/google/acc?${queryParams.toString()}`, {
        method: "GET",
    })
}

export async function updateGoogleAccount(id: string, field: string, value: any): Promise<ApiResponse<null>> {
    return await fetcherBackEnd<ApiResponse<null>>(`/api/google/acc/${id}`, {
        method: "PATCH",
        body: { field, value },
    })
}

export async function deleteGoogleAccount(id: string): Promise<ApiResponse<null>> {
    return await fetcherBackEnd<ApiResponse<null>>(`/api/google/acc/${id}`, {
        method: "DELETE",
    })
}

export async function createGoogleAccount(data: GoogleAccountCreateData): Promise<ApiResponse<GoogleAccount>> {
    return await fetcherBackEnd<ApiResponse<GoogleAccount>>(`/api/google/acc`, {
        method: "POST",
        body: data,
    })
}

export async function sendMailToOtherEmail(fromAccountId: string, to: string, subject: string, message: string): Promise<ApiResponse<null>> {
    return await fetcherBackEnd<ApiResponse<null>>(`/api/google/acc/${fromAccountId}/send-mail-to-mail`, {
        method: "POST",
        body: { to, subject, message },
    })
}

export async function getHistorySentEmail(googleAccountId: string, page: number, limit: number): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    return await fetcherBackEnd<ApiResponse<PaginatedResponse<any>>>(`/api/google/acc/${googleAccountId}/history-send-mail?${queryParams.toString()}`, {
        method: "GET",
    })
}
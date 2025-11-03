import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import ApiResponse from "../intefaces/apiResponseData";
import { GoogleAccountResponse } from "../intefaces/googleData";

export async function getGoogleAccount(page: number, limit: number, status: string, search: string): Promise<ApiResponse<GoogleAccountResponse>> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (status) queryParams.append("status", status);
    if (search) queryParams.append("search", search);
    return await fetcherBackEnd<ApiResponse<GoogleAccountResponse>>(`/api/google?${queryParams.toString()}`, {
        method: "GET",
    })
}
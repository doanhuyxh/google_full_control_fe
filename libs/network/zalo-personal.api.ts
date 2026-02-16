import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import ApiResponse, { ApiZaloResponse, PaginatedResponse } from "@/libs/intefaces/apiResponseData";
import ZaloPersonalData, { ZaloPersonalDataFormData, ZaloPersonalDataUpdateData } from "@/libs/intefaces/zaloPersonal";
import { ChangedProfiles, ZaloGroup, ZaloLoginInfo, ZaloPersonalGroupData, ZaloPersonalGroupMemberData } from "../intefaces/zaloPersonal/zaloAccData";

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

export async function initZaloPersonalLoginQr(id:string, socketId: string) {
    return await fetcherBackEnd<ApiResponse<{ loginUrl: string }>>(`/api/zalo-personal/${id}/login-qr?clientId=${socketId}`, {
        method: "GET",
    })
}

export async function loginZaloPersonalViaCookie(id:string) {
    return await fetcherBackEnd<ApiResponse<null>>(`/api/zalo-personal/${id}/login-cookie`, {
        method: "GET",
    })
}

export async function getLoginInfoAccZalo(id:string) {
    return await fetcherBackEnd<ApiZaloResponse<ZaloLoginInfo>>(`/api/zalo-personal/${id}/get-account-login-info`, {
        method: "GET",
    })
}

export async function getZaloPersonalGroups(id:string) {
    return await fetcherBackEnd<ApiZaloResponse<ZaloGroup>>(`/api/zalo-personal/${id}/get-all-groups`, {
        method: "GET",
    })
}

export async function getZaloPersonalGroupsDetails(id:string, groupIds: string[]) {
    const params = new URLSearchParams();
    groupIds.forEach((gId) => {
        params.append('groupIds', gId);
    });
    return await fetcherBackEnd<ApiZaloResponse<ZaloPersonalGroupData>>(`/api/zalo-personal/${id}/get-groups-info?${params.toString()}`, {
        method: "GET",
    })
}

export async function leaveZaloGroup(id:string, groupId: string) {
    return await fetcherBackEnd<ApiZaloResponse<any>>(`/api/zalo-personal/${id}/leave-group/${groupId}`, {
        method: "DELETE",
    })
}

export async function getMemberInZaloGroup(id:string, groupId: string, memberIds: string[]) {
    const params = new URLSearchParams();
    memberIds.forEach((mId) => {
        params.append('memberIds', mId);
    });
    return await fetcherBackEnd<ApiZaloResponse<ZaloPersonalGroupMemberData>>(`/api/zalo-personal/${id}/get-group-members/${groupId}?${params.toString()}`, {
        method: "GET",
    })
}

export async function getAllFrendInZalo(id:string) {
    const params = new URLSearchParams();
    params.append('page', "1");
    params.append('count', "2000");
    return await fetcherBackEnd<ApiZaloResponse<ChangedProfiles[]>>(`/api/zalo-personal/${id}/get-all-friends?${params.toString()}`, {
        method: "GET",
    })
}
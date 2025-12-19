import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import ApiResponse, { PaginatedResponse } from "@/libs/intefaces/apiResponseData";
import { TelegramAccountData } from "../intefaces/telegramData";



export async function getTelegramAccounts(page: number, limit: number, search: string): Promise<ApiResponse<PaginatedResponse<TelegramAccountData>>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (search) {
        queryParams.append('search', search);
    }
    const response = await fetcherBackEnd<ApiResponse<PaginatedResponse<TelegramAccountData>>>(`/api/telegram-acc?${queryParams.toString()}`);
    return response;
}

export async function deleteTelegramAccount(telegramAccId: string): Promise<ApiResponse<null>> {
    const response = await fetcherBackEnd<ApiResponse<null>>(`/api/telegram-acc/${telegramAccId}`, {
        method: 'DELETE',
    });
    return response;
}

export async function getTelegramAccountDetail(telegramAccId: string): Promise<ApiResponse<TelegramAccountData>> {
    return await fetcherBackEnd<ApiResponse<TelegramAccountData>>(`/api/telegram-acc/${telegramAccId}`);
}

export async function createTelegramAccount(formData: FormData): Promise<ApiResponse<TelegramAccountData>> {
    return await fetcherBackEnd<ApiResponse<TelegramAccountData>>(`/api/telegram-acc`, {
        method: 'POST',
        body: formData,
    });
}


export async function updateTelegramAccount(telegramAccId: string, formData: FormData): Promise<ApiResponse<TelegramAccountData>> {
    return await fetcherBackEnd<ApiResponse<TelegramAccountData>>(`/api/telegram-acc/${telegramAccId}`, {
        method: 'PUT',
        body: formData,
    });
}

export default interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
    statusCode: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export interface ZaloPersonalAccountDataResponse {
    error_code: number;
    error_message: string;
    data: Record<string, any>;
}

export interface ApiZaloResponse extends ApiResponse<ZaloPersonalAccountDataResponse> {
}

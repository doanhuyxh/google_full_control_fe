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

export interface ZaloPersonalAccountDataResponse<T> {
    error_code: number;
    error_message: string;
    data: T;
}

export interface ApiZaloResponse<T> extends ApiResponse<ZaloPersonalAccountDataResponse<T>> {
}

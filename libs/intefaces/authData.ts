
export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        role: string;
        email: string;
    };
}

export interface LoginHistory {
    _id: string;
    userAgent: string;
    ipAddress: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    createdAt: Date;
}

export interface LoginHistoryResponse {
    items: LoginHistory[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
const baseURL = process.env.NEXT_PUBLIC_BACK_END_API_BASE_URL || '';
import ApiResponse from '@/libs/intefaces/apiResponseData';
import { RcFile } from 'antd/es/upload';
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
    method?: Method;
    body?: any;
    headers?: Record<string, string>;
    cache?: RequestCache;
}

export async function fetcherBackEnd<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${baseURL}${endpoint}`;
    let token = '';
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token') || '';
    }
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const res = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: 'include',
        cache: options.cache || 'no-store',
    });
    if (!res.ok) {
        const errorResponse: ApiResponse<null> = {
            status: false,
            message: `Error: ${res.status} ${res.statusText}`,
            data: null,
            statusCode: 500,
        };
        throw errorResponse; // ném ra đúng format API response
    }
    const json = await res.json();

    if (json.status === false && json.statusCode == 401) {
        if (typeof window !== 'undefined') {
            document.cookie = '';
            localStorage.clear();
            window.location.href = '/logout';
        }
    }
    return json;
}

export async function uploadFileServer(file: RcFile): Promise<any> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/uploads', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch {
        return null;
    }
}
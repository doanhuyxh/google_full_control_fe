
export interface CloudinaryData {
    _id: string;
    accountMail: string;
    apiKey: string;
    apiSecret: string;
    cloudName: string;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CloudinaryDataResponse {
    cloudinaryAccounts: CloudinaryData[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export interface CloudinaryDataFormData {
    accountMail: string;
    apiKey: string;
    apiSecret: string;
    cloudName: string;
    note: string;
}
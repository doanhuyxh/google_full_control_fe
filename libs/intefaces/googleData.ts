
export interface GoogleAccount {
    _id: string;
    avatar: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    currentPassword: string;
    appPassword: string;
    privateCode: string;
    recoveryEmail: string;
    f2a: string;
    status: string;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GoogleAccountResponse {
    accounts: GoogleAccount[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export interface GoogleAccountCreateData {
    fullName: string;
    email: string;
    phoneNumber: string;
    currentPassword: string;
    appPassword: string;
    privateCode: string;
    recoveryEmail: string;
    f2a: string;
}

export const GoogleAccountStatusOptions = [
    { value: 'live', label: 'Sống' },
    { value: 'suspended', label: 'Cấm (Khóa)' },
    { value: 'phone_verification', label: 'Xác minh điện thoại' }
];

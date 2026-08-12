export interface OAuth2Tokens {

    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
}

export interface GoogleAccount {
    _id: string;
    avatar: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    currentPassword: string;
    appPassword: string;
    privateCode: string;
    cookies: string;
    recoveryEmail: string;
    f2a: string;
    status: string;
    note: string;
    resources_used: string[];
    totalSendMailToday: string;
    totalDriverStrongUse: string;
    oauthTwoTokens: OAuth2Tokens;
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
    cookies?: string;
    recoveryEmail: string;
    f2a: string;
}

export const GoogleAccountStatusOptions = [
    { value: 'live', label: 'Sống' },
    { value: 'suspended', label: 'Cấm (Khóa)' },
    { value: 'phone_verification', label: 'Xác minh điện thoại' }
];

export const GoogleAccountResourcesUsedOptions = [
    { value: 'gmail', label: 'Gmail' },
    { value: 'drive', label: 'Drive' },
];
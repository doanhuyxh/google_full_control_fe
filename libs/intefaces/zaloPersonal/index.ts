export default interface ZaloPersonalData {
    _id: string;
    display_name: string;
    avatar: string;
    avatarUrl: string;
    phoneNumber: string;
    password: string;
    imei: string;
    secret_key: string;
    cookie: string;
    isLogin: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ZaloPersonalDataFormData {
    display_name: string;
    phoneNumber: string;
    password: string;
}

export interface ZaloPersonalDataUpdateData extends ZaloPersonalDataFormData {
    imei: string;
    secret_key: string;
    cookie: string;
}


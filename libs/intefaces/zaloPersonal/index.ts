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

export interface ContentPhoto {
    title: string
    description: string
    href: string
    thumb: string
    childnumber: number
    action: string
    params: string
    type: string
}

export interface ContentVoice {
    title: string
    description: string
    href: string
    thumb: string
    childnumber: number
    action: string
    params: string
    type: string
}

export interface ZaloPersonalMessageHistoryData {
    _id: string
    zaloPersonalAccountId: string
    threadType: number
    threadId: string
    msgId: string
    msgType: string
    uidFrom: string
    dName: string
    content: ContentPhoto | ContentVoice | string
    createdAt: string
    updatedAt: string
    __v: number
}


export default interface TikTokAccountData {
    _id: string;
    uid: string;
    secUid: string;
    uniqueId: string;
    nickName: string;
    signature: string;
    password: string;
    email: string;
    phoneNumber: string;
    f2a: string;
    countryCode: string;
    cookies: string;
}

export interface FormTikTokAccountData {
    uniqueId: string;
    uid: string;
    secUid: string;
    nickName: string;
    signature: string;
    password: string;
    email: string;
    phoneNumber: string;
    f2a: string;
    countryCode: string;
    cookies: string;
}
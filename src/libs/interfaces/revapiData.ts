
export default interface RevapiData {
    _id: string
    email: string
    password: string
    createdAt: string
    updatedAt: string
    access_token: string
    revidapi_user_id: string
    credit: number
    api_key: string
}

export interface FormRevapiData {
    email: string
    password: string
    access_token?: string
    api_key?: string
}
export interface TelegramAccountData {
    _id: string;
    name: string;
    phoneNumber: string;
    username?: string;
    apiId?: number;
    email?: string;
    f2a?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BotTelegramAccountData {
    _id: string;
    telegramAccId: string;
    botToken: string;
    botUsername?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface FormTelegramAccount {
    phoneNumber: string;
    apiId: number;
    apiHash: string;
    email?: string;
    f2a?: string;
}

export interface FormBotTelegram {
    botToken:string;
    botUsername:string;
    note:string
}
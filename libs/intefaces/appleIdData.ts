

export interface QuestionSecurity {
    question: string;
    answer: string;
}

export default interface AppleIdData {
    _id: string;
    appleId: string;
    password: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    countryCode: string;
    birthday: string;
    address: string;
    questionSecurity: QuestionSecurity[];
    createdAt: Date;
    updatedAt: Date;
}

export interface FormAppleIdData {
    appleId: string;
    password: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    countryCode: string;
    birthday: string;
    address: string;
    questionSecurity: QuestionSecurity[];
}
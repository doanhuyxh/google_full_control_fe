
export default interface CountryData {
    flags:{
        svg: string;
        png: string;
    }
    name:{
        common: string;
        official: string;
        nativeName:{
            [key: string]: {
                official: string;
                common: string;
            }
        }
    }
    cca2: string;
    cca3: string;
    ccn3: string;
    cioc: string;
    independent: boolean;
    status: string;
    unMember: boolean;
}
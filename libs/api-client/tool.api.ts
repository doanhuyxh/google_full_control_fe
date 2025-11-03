import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";

export async function decodeDataApi(data: string) {
    return await fetcherBackEnd("/api/tools/decode-data", {
        method: "POST",
        body: { data },
    });
}

export async function encodeDataApi(data: string) {
    return await fetcherBackEnd("/api/tools/encode-data", {
        method: "POST",
        body: { data },
    });
}
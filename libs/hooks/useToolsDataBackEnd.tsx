
import { encodeDataApi, decodeDataApi } from '@/libs/api-client/tool.api';

export function useToolsDataBackEnd() {
    
    async function encodeData(data: string) {
        const response = await encodeDataApi(data);
        return response.data;
    }

    async function decodeData(data: string) {
        const response = await decodeDataApi(data);
        return response.data;
    }

    return {
        encodeData,
        decodeData
    };
}
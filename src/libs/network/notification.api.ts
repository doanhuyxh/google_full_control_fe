import { fetcherBackEnd } from "@/libs/fetchFromBackEnd";
import ApiResponse from "@/libs/interfaces/apiResponseData";

export async function registerFcmTokenApi(fcmToken: string): Promise<ApiResponse<null>> {
  return fetcherBackEnd<ApiResponse<null>>("/api/notifications/fcm-token", {
    method: "POST",
    body: { fcmToken },
  });
}

export async function unregisterFcmTokenApi(fcmToken: string): Promise<ApiResponse<null>> {
  return fetcherBackEnd<ApiResponse<null>>("/api/notifications/fcm-token", {
    method: "DELETE",
    body: { fcmToken },
  });
}

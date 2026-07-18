"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getToken, MessagePayload, onMessage } from "firebase/messaging";

import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { checkMessagingSupport, getFirebaseMessaging } from "@/libs/firebase/client";
import { getFirebaseVapidKey } from "@/libs/firebase/config";
import { registerFcmTokenApi } from "@/libs/network/notification.api";

const FCM_TOKEN_STORAGE_KEY = "fcm_token";

type FirebaseContextValue = {
  fcmToken: string | null;
  permission: NotificationPermission | null;
  isSupported: boolean;
  isReady: boolean;
  requestPermission: () => Promise<string | null>;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

function showForegroundNotification(
  payload: MessagePayload,
  notification: ReturnType<typeof useAntdApp>["notification"]
) {
  const title = payload.notification?.title ?? payload.data?.title ?? "Thông báo";
  const description = payload.notification?.body ?? payload.data?.body ?? "";

  notification.open({
    message: title,
    description,
    placement: "bottomRight",
    duration: 5,
  });
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register("/firebase-messaging-sw.js");
}

export function useFirebase() {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error("useFirebase must be used within FirebaseProvider");
  }

  return context;
}

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { notification } = useAntdApp();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isRegisteringRef = useRef(false);

  const syncTokenWithBackend = useCallback(async (token: string) => {
    const storedToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);

    if (storedToken === token) {
      return;
    }

    const result = await registerFcmTokenApi(token);

    if (result.status) {
      localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
    }
  }, []);

  const acquireFcmToken = useCallback(async (): Promise<string | null> => {
    if (isRegisteringRef.current) {
      return fcmToken;
    }

    const firebaseVapidKey = getFirebaseVapidKey();

    if (!firebaseVapidKey) {
      console.warn(
        "[Firebase] Missing or invalid NEXT_PUBLIC_FIREBASE_VAPID_KEY. " +
          "Get it from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates."
      );
      return null;
    }

    if (typeof window === "undefined" || !("Notification" in window)) {
      return null;
    }

    const supported = await checkMessagingSupport();

    if (!supported) {
      return null;
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      return null;
    }

    isRegisteringRef.current = true;

    try {
      const registration = await registerServiceWorker();
      const token = await getToken(messaging, {
        vapidKey: firebaseVapidKey,
        serviceWorkerRegistration: registration ?? undefined,
      });

      if (!token) {
        return null;
      }

      setFcmToken(token);
      await syncTokenWithBackend(token);
      return token;
    } catch (error) {
      console.error("[Firebase] Failed to get FCM token:", error);
      return null;
    } finally {
      isRegisteringRef.current = false;
    }
  }, [fcmToken, syncTokenWithBackend]);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return null;
    }

    const nextPermission =
      Notification.permission === "default"
        ? await Notification.requestPermission()
        : Notification.permission;

    setPermission(nextPermission);

    if (nextPermission !== "granted") {
      return null;
    }

    return acquireFcmToken();
  }, [acquireFcmToken]);

  useEffect(() => {
    let isMounted = true;

    const initMessaging = async () => {
      const supported = await checkMessagingSupport();
      if (!isMounted) return;

      setIsSupported(supported);

      if (!supported || typeof window === "undefined" || !("Notification" in window)) {
        setIsReady(true);
        return;
      }

      setPermission(Notification.permission);

      const messaging = await getFirebaseMessaging();
      if (!isMounted || !messaging) {
        setIsReady(true);
        return;
      }

      onMessage(messaging, (payload) => {
        showForegroundNotification(payload, notification);
      });

      if (Notification.permission === "granted") {
        await acquireFcmToken();
      }

      if (isMounted) {
        setIsReady(true);
      }
    };

    initMessaging();

    return () => {
      isMounted = false;
    };
  }, [acquireFcmToken, notification]);

  useEffect(() => {
    if (!isSupported || permission !== "default") {
      return;
    }

    const handleUserGesture = () => {
      void requestPermission();
    };

    document.addEventListener("click", handleUserGesture, { once: true });

    return () => {
      document.removeEventListener("click", handleUserGesture);
    };
  }, [isSupported, permission, requestPermission]);

  const value = useMemo(
    () => ({
      fcmToken,
      permission,
      isSupported,
      isReady,
      requestPermission,
    }),
    [fcmToken, permission, isSupported, isReady, requestPermission]
  );

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

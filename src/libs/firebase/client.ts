import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Messaging, getMessaging, isSupported } from "firebase/messaging";

import { getFirebaseConfig } from "./config";

let messagingInstance: Messaging | null = null;
let messagingSupported: boolean | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(getFirebaseConfig());
}

export async function checkMessagingSupport(): Promise<boolean> {
  if (messagingSupported !== null) {
    return messagingSupported;
  }

  messagingSupported = await isSupported();
  return messagingSupported;
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  const supported = await checkMessagingSupport();

  if (!supported) {
    return null;
  }

  if (!messagingInstance) {
    messagingInstance = getMessaging(getFirebaseApp());
  }

  return messagingInstance;
}

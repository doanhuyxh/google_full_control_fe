import { EnvsConfigKey } from "@/libs/constants/configKey";

type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

let firebaseConfigCache: FirebaseClientConfig | null = null;

export function getFirebaseConfig(): FirebaseClientConfig {
  if (firebaseConfigCache) {
    return firebaseConfigCache;
  }

  const {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
  } = EnvsConfigKey;

  if (
    !FIREBASE_API_KEY ||
    !FIREBASE_AUTH_DOMAIN ||
    !FIREBASE_PROJECT_ID ||
    !FIREBASE_STORAGE_BUCKET ||
    !FIREBASE_MESSAGING_SENDER_ID ||
    !FIREBASE_APP_ID
  ) {
    throw new Error("Missing Firebase environment variables");
  }

  firebaseConfigCache = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  };

  return firebaseConfigCache;
}

export function getFirebaseVapidKey(): string {
  const value = EnvsConfigKey.FIREBASE_VAPID_KEY ?? "";

  if (!value) {
    return "";
  }

  if (!isValidVapidKey(value)) {
    console.warn(
      "[Firebase] NEXT_PUBLIC_FIREBASE_VAPID_KEY is invalid. " +
        "Use the Web Push key pair from Firebase Console → Project Settings → Cloud Messaging. " +
        "Do not use the Firebase API key."
    );
    return "";
  }

  return value;
}

export function isValidVapidKey(key: string): boolean {
  if (key.startsWith("AIza")) {
    return false;
  }

  return /^[A-Za-z0-9_-]{80,}$/.test(key);
}

importScripts("/firebase-config.js");
importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js");

firebase.initializeApp(FIREBASE_CONFIG);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "Thông báo";
  const options = {
    body: payload.notification?.body ?? "",
    icon: payload.notification?.icon ?? "/favicon.ico",
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});

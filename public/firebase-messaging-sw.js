// public/firebase-messaging-sw.js
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDUCF3IQqD8No_Kh2herRvPpHjZ6pKG0Lo",
  authDomain: "hali-il.firebaseapp.com",
  projectId: "hali-il",
  storageBucket: "hali-il.firebasestorage.app",
  messagingSenderId: "561374706810",
  appId: "1:561374706810:web:b7c01e3445eab36f034fc3",
});

const messaging = firebase.messaging();

// 백그라운드 수신 처리
messaging.onBackgroundMessage(function (payload) {
  console.log("📨 백그라운드 메시지 수신: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

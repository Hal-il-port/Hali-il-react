// src/firebase/fcm.js
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "./firebaseConfig";
import SERVER_URL from "../config/server";

const messaging = getMessaging(app);

// VAPID 키는 Firebase 콘솔 → Cloud Messaging → 웹 푸시 인증서에서 생성한 public key
const VAPID_KEY =
  "BEdD5bmKeH0qHL4o5LNuiGM-BMZtQAz_QCNuFDao9slQFRGMSMQaSx1xYux1fLhMMOaZQMIW01amDRyjB8NiDYQ";

export const requestPermissionAndToken = async () => {
  console.log("🔔 알림 권한 요청 중...");
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("✅ 알림 권한 허용됨");
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("📱 FCM Token:", token);
    return token;
  } else {
    console.log("❌ 알림 권한 거부됨");
    return null;
  }
};

// 앱이 켜져 있을 때 수신되는 메시지 (포그라운드)
export const onForegroundMessage = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("📩 포그라운드 메시지 수신:", payload);
    callback(payload);
  });
};

export const sendTokenToServer = async (token, userId) => {
  try {
    await fetch(`${SERVER_URL}/api/fcm/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, token }),
    });
    console.log("✅ 토큰 서버 전송 완료");
  } catch (err) {
    console.error("❌ 토큰 서버 전송 실패:", err);
  }
};

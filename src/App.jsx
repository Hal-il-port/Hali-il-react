import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mypage from "./pages/Mypage";
import Notfound from "./pages/Notfound";
import Groups from "./pages/Groups";
import Friends from "./pages/Friends";
import AddFriend from "./pages/AddFriend";
import CreateGroup from "./pages/CreateGroup";
import ManageGroup from "./pages/manageGroup";

// 🔔 FCM 관련 import
import { requestPermissionAndToken } from "./firebase/fcm";
import SERVER_URL from "./config/server"; // 서버 주소 import

function App() {
  useEffect(() => {
    // ----------------- FCM 서비스워커 등록 -----------------
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ FCM Service Worker 등록 성공:", registration);
        })
        .catch((err) => {
          console.error("❌ Service Worker 등록 실패:", err);
        });
    }

    // ----------------- 브라우저 알림 권한 요청 + 토큰 발급 -----------------
    const initFCM = async () => {
      const token = await requestPermissionAndToken();
      if (token) {
        console.log("📱 발급된 FCM 토큰:", token);

        try {
          const accessToken = localStorage.getItem("accessToken");
          if (accessToken) {
            const payload = { token };
            console.log("🛰 서버로 보내는 토큰 payload:", payload);

            const res = await fetch(`${SERVER_URL}/api/fcm/register`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(payload),
            });

            console.log("📡 서버 응답 status:", res.status);

            if (res.ok) {
              console.log("✅ 서버에 FCM 토큰 등록 완료");
            } else {
              const errorText = await res.text();
              console.error("❌ 서버 토큰 등록 실패:", errorText);
            }
          }
        } catch (err) {
          console.error("❌ 서버 토큰 등록 시 에러:", err);
        }
      }
    };

    initFCM();

    // ----------------- 주기적 알림 요청 -----------------
    const interval = setInterval(async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          await fetch(`${SERVER_URL}/api/notifications/check-deadline`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log("🔔 서버 알림 요청 완료");
        }
      } catch (err) {
        console.error("❌ 서버 알림 요청 실패:", err);
      }
    }, 1000 * 60 * 60); // 1시간마다 체크

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/add-friend" element={<AddFriend />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/manageGroup/:teamId" element={<ManageGroup />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;

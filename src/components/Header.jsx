import "./Header.css";
import { useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import Notice from "./Notice";
import { useEffect, useState } from "react";

// JWT payload 파싱 함수
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const Header = () => {
  const nav = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // 토큰 유효성 검사
  const checkTokenValidity = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;

    const payload = parseJwt(accessToken);
    if (!payload || !payload.exp) return false;

    const now = Date.now();
    const expireTime = payload.exp * 1000; // 초 → 밀리초

    console.log("토큰 만료 시간:", new Date(expireTime).toLocaleString());
    return now < expireTime;
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const loggedIn = checkTokenValidity();
    setIsLoggedIn(loggedIn);

    console.log("현재 로그인 상태:", loggedIn);

    if (loggedIn && accessToken) {
      const payload = parseJwt(accessToken);
      setUserName(payload?.name || "사용자");
    }
  }, []);

  const onHome = () => nav("/", { replace: true });
  const onLogin = () => nav("/login");
  const onSignup = () => nav("/signup");

  return (
    <div className="Header" style={{ position: "relative" }}>
      <div className="title" onClick={onHome}>
        <div className="big">Hal il</div>
        <div className="small">할일을 기록 및 팀원과 공유 해 보세요!</div>
      </div>

      {!isLoggedIn && (
        <div className="berforeLoggedIn">
          <div className="Login" onClick={onLogin}>
            login
          </div>
          <div className="Signup" onClick={onSignup}>
            sign up
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="isLoggedIn">
          <Notice />
          <div>{userName}</div>
          <MenuItems />
        </div>
      )}
    </div>
  );
};

export default Header;

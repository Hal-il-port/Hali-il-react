import Button from "../components/Button";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import SERVER_URL from "../config/server";

// JWT 파싱 함수
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

const Login = () => {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const doneLogin = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`❌ 로그인 실패: ${errorText || res.statusText}`);
        return;
      }

      const data = await res.json();
      console.log("🔐 서버 응답 데이터:", data);

      const token = data.accessToken || data.token;
      if (!token) {
        alert("❌ 로그인 응답에 토큰이 없습니다.");
        return;
      }

      // JWT payload 파싱
      const payload = parseJwt(token);
      if (!payload || !payload.exp) {
        alert("❌ 토큰 파싱 실패 또는 만료 시간 없음");
        return;
      }

      console.log("✅ JWT Payload:", payload);

      // 토큰 저장
      localStorage.setItem("accessToken", token);

      alert("✅ 로그인 성공!");
      nav("/", { replace: true });
    } catch (err) {
      console.error("❌ 로그인 에러:", err);
      alert("❌ 서버 오류로 로그인에 실패했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <div className="LoginWrapper">
        <label>
          Email
          <input
            className="EditText"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            className="EditText"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="ToggleButton" onClick={togglePassword}>
          {showPassword ? "Hide Password" : "Show Password"}
        </button>

        <Button onClick={doneLogin} text={"Log in"} type={"LOGIN"} />
      </div>
    </div>
  );
};

export default Login;

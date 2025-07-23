import Header from "../components/Header";
import Button from "../components/Button";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SERVER_URL from "../config/server"; // 서버 주소는 config 파일 등에서 import

const Signup = () => {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const isPasswordMismatch =
    password && checkPassword && password !== checkPassword;

  const doneSignup = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        alert("✅ 회원가입이 완료되었습니다!");
        nav("/login", { replace: true });
      } else {
        alert("❌ 회원가입 실패. 잠시 후 다시 시도해 주세요.");
      }
    } catch (err) {
      console.error("❌ 회원가입 에러:", err);
      alert("❌ 네트워크 오류 또는 서버 문제로 실패했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <div className="SignupWrapper">
        <label>
          Name
          <input
            className="EditText"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

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

        <label>
          Check Password
          <input
            className={`EditText ${isPasswordMismatch ? "error" : ""}`}
            type={showPassword ? "text" : "password"}
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
        </label>

        <button className="ToggleButton" onClick={togglePassword}>
          {showPassword ? "Hide Password" : "Show Password"}
        </button>

        <Button
          text={"Sign up"}
          type={"LOGIN"}
          onClick={doneSignup}
          disabled={isPasswordMismatch}
        />
      </div>
    </div>
  );
};

export default Signup;

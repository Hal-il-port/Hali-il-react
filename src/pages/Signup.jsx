import Header from "../components/Header";
import Button from "../components/Button";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
    const nav = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(prev => !prev);

    const isPasswordMismatch =
        password && checkPassword && password !== checkPassword;

    const doneSignup = () => {
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Check Password:", checkPassword);
        nav("/", { replace: true });
    };

    return (
        <div>
            <Header />
            <div className="SignupWrapper">
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

import Button from "../components/Button";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {

    const nav = useNavigate();
    const doneLogin = ()=> nav("/", {replace:true});

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(prev => !prev);


    return (
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

                <Button 
                onClick={doneLogin}
                text={"Log in"}
                type={"LOGIN"}/>
        </div>
    );
}

export default Login;
import "./Header.css";
import { useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems"; 
import Notice from "./Notice";

const Header = ({brfore, after}) => {
    const nav = useNavigate();

    const onHome = () => nav("/", { replace: true });
    const onLogin = () => nav("/login");
    const onSignup = () => nav("/signup");



    return (
        <div className="Header" style={{ position: "relative" }}>
            <div className="title" onClick={onHome}>
                <div className="big">Hal il</div>
                <div className="small">할일을 기록 및 팀원과 공유 해 보세요!</div>
            </div>

            <div className="Login" onClick={onLogin}>login</div>
            <div className="Signup" onClick={onSignup}>sign up</div>

            <Notice />
            <div>이름</div>
            <MenuItems />
        </div>
    );
};

export default Header;

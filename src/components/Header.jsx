import "./Header.css";
import { useNavigate } from "react-router-dom";
import menuIcon from '../assets/menu_icon.svg';
import { useState, useRef, useEffect } from "react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);  // 메뉴 컨테이너 참조

    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    // 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const nav = useNavigate();
    const onHome = () => nav("/", {replace:true});
    const onLogin = ()=> nav("/login");
    const onSignup = () => nav("/signup");

    const menuItems = ["내용1", "내용2", "내용3", "내용4", "내용5"];

    return (
        <div className="Header" style={{ position: "relative" }}>
            <div 
            className="title"
            onClick={onHome}>Hal Il</div>
            <div 
            className="Login"
            onClick={onLogin}>login</div>
            <div 
            className="Signup"
            onClick={onSignup}>sign up</div>
            <div className="notice">알림</div>
            <div>이름</div>

            <div className="menu-container" ref={menuRef}>
                <img
                    src={menuIcon}
                    alt="menu icon"
                    className="menu-icon"
                    onClick={toggleMenu}
                    style={{ cursor: "pointer", width: 24, height: 24 }}
                />

                {isMenuOpen && (
                    <div className="dropdown-menu">
                        {menuItems.map((item, idx) => (
                            <div key={idx} className="dropdown-item">
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;

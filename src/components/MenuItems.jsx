import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import menuIcon from '../assets/menu_icon.svg';
import "./Header.css";


const MenuItems = () => {
    const nav = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    const handleItemClick = (item) => {
        setIsMenuOpen(false); // 메뉴 닫기
        switch (item) {
            case "마이페이지":
                nav("/Mypage");
                break;
            case "친구 관리":
                nav("/friends");
                break;
            case "그룹 관리":
                nav("/groups");
                break;
            case "게시판":
                nav("/board");
                break;
            case "로그아웃":
                // 로그아웃 로직 실행
                alert("로그아웃 되었습니다");
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const menuItems = ["마이페이지", "친구 관리", "그룹 관리", "게시판", "로그아웃"];

    return (
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
                        <div
                            key={idx}
                            className="dropdown-item"
                            onClick={() => handleItemClick(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuItems;

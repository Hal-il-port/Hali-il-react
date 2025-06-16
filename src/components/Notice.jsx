import { useRef, useState, useEffect } from 'react';
import "./Header.css";


const Notice = () => {
    const [isNoticeOpen, setIsNoticeOpen] = useState(false);
    const noticeRef = useRef(null);

    const handleItemClick = (item) => {
        setIsNoticeOpen(false); // 메뉴 닫기
        switch (item) {
            case "알림1":
                console.log("알림1");
                break;
            case "알림2":
                console.log("알림2");
                break;
            case "알림3":
                console.log("알림3");
                break;
            case "알림4":
                console.log("알림4");
                break;
            case "알림5":
                console.log("알림5");
                break;
            default:
                break;
        }
    };

    const toggleNotice = () => setIsNoticeOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (noticeRef.current && !noticeRef.current.contains(event.target)) {
                setIsNoticeOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const noticeItems = ["알림1", "알림2", "알림3", "알림4", "알림5"];



    return (
        <div className="notice-container" ref={noticeRef}>
            <div
                alt="notice icon"
                className="notice-icon"
                onClick={toggleNotice}
                style={{ cursor: "pointer"}}
                >알림</div>
        
                {isNoticeOpen && (
                    <div className="dropdown-notice">
                        {noticeItems.map((item, idx) => (
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
}

export default Notice;
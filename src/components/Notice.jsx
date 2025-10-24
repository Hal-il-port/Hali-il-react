import { useRef, useState, useEffect } from "react";
import "./Header.css";

const Notice = ({ alerts = [] }) => {
  // 기본값 [] 추가
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const noticeRef = useRef(null);

  const toggleNotice = () => setIsNoticeOpen((prev) => !prev);

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

  return (
    <div className="notice-container" ref={noticeRef}>
      <div
        className="notice-icon"
        onClick={toggleNotice}
        style={{ cursor: "pointer" }}
      >
        알림 ({alerts.length})
      </div>

      {isNoticeOpen && (
        <div className="dropdown-notice">
          {alerts.length === 0 ? (
            <div className="dropdown-item">알림이 없습니다.</div>
          ) : (
            alerts.map((item, idx) => (
              <div key={idx} className="dropdown-item">
                {item}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notice;

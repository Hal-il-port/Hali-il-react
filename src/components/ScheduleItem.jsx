import "./ScheduleItem.css";
import { useState } from "react";

const ScheduleItem = ({ label }) => {
    const [isDone, setIsDone] = useState(false);

    const toggleState = () => {
        setIsDone(prev => !prev);
    };
    return (
        <div className="ScheduleItem">
            <div><strong></strong></div>

            {/* label이 '개인용'이 아닐 때만 name 보여줌 */}
            {label !== '개인용' && <div>name</div>}

            <div>content</div>
            <div>finish line</div>
            <button
                className={`State_Button ${isDone ? "done" : "in-progress"}`}
                onClick={toggleState}
            >
                {isDone ? "완료" : "진행중"}
            </button>

            <button className="Manage_Button">수정/삭제</button>
        </div>
    );
};

export default ScheduleItem;

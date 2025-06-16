import "./ScheduleItem.css";
import { useState } from "react";

const ScheduleItem = ({ content, end_datetime, name, onDelete }) => {
  const [isDone, setIsDone] = useState(false);

  const toggleState = () => {
    setIsDone(prev => !prev);
  };

  return (
    <div className="ScheduleItem">
      {name && <div><strong>{name}</strong></div>}
      <div>{content}</div>
      <div>{end_datetime}</div>
      <button
        className={`State_Button ${isDone ? "done" : "in-progress"}`}
        onClick={toggleState}
      >
        {isDone ? "완료" : "진행중"}
      </button>
      <button className="Manage_Button" onClick={onDelete}>삭제</button>
    </div>
  );
};

export default ScheduleItem;

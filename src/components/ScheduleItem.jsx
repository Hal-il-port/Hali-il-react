import "./ScheduleItem.css";

const ScheduleItem = ({
  id,
  content,
  end_datetime,
  name,
  isDone,
  onDelete,
  onToggle,
}) => {
  return (
    <div className={`ScheduleItem ${isDone ? "done-item" : ""}`}>
      {/* 이름이 있을 때만 출력 (그룹 일정 등) */}
      {name && (
        <div className="ScheduleItem-name">
          <strong>{name}</strong>
        </div>
      )}

      <div className="ScheduleItem-content">{content}</div>
      <div className="ScheduleItem-deadline">
        마감일: {end_datetime || "없음"}
      </div>

      <div className="ScheduleItem-actions">
        <button
          className={`State_Button ${isDone ? "done" : "in-progress"}`}
          onClick={onToggle}
        >
          {isDone ? "완료" : "진행중"}
        </button>

        <button className="Manage_Button" onClick={onDelete}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default ScheduleItem;

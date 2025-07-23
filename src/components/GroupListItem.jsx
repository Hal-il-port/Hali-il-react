import "./GroupListItem.css";

const GroupListItem = ({ name, onLeave }) => {
  return (
    <li className="group-item">
      <span>{name}</span>
      <button className="leave-button" onClick={onLeave}>
        그룹 나가기
      </button>
      <button className="deleteGroup">그룹 삭제</button>
    </li>
  );
};

export default GroupListItem;

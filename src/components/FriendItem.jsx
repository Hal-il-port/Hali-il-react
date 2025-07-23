import "./FriendItem.css";

const FriendItem = ({ name, onDelete }) => {
  return (
    <li className="friend-item">
      <span>{name}</span>
      <button className="delete-button" onClick={onDelete}>
        삭제
      </button>
    </li>
  );
};

export default FriendItem;

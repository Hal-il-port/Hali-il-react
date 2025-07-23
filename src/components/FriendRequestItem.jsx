import "./FriendRequestItem.css";

const FriendRequestItem = ({ name, onAccept, onReject }) => {
  return (
    <li className="request-item">
      <span>{name}</span>
      <div className="request-actions">
        <button className="accept-button" onClick={onAccept}>
          ✔
        </button>
        <button className="reject-button" onClick={onReject}>
          ✖
        </button>
      </div>
    </li>
  );
};

export default FriendRequestItem;

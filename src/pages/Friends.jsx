import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FriendItem from "../components/FriendItem";
import FriendRequestItem from "../components/FriendRequestItem";
import "./Friends.css";
import SERVER_URL from "../config/server";

const Friends = () => {
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  // 받은 친구 요청 불러오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchRequests = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/friends/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("❌ 친구 요청 불러오기 실패");
          return;
        }

        const data = await res.json();
        setRequests(data); // [{requestId, name, email}, ...]
      } catch (err) {
        console.error("❌ 요청 에러:", err);
      }
    };

    fetchRequests();
  }, []);

  // 친구 목록 불러오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchFriends = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/friends`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("❌ 친구 목록 불러오기 실패");
          return;
        }

        const data = await res.json();
        setFriends(data); // [{name, email}, ...] 또는 문자열 배열
      } catch (err) {
        console.error("❌ 친구 목록 요청 에러:", err);
      }
    };

    fetchFriends();
  }, []);

  // 친구 요청 수락
  const handleAccept = async (requestId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`${SERVER_URL}/api/friends/accept/${requestId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("친구 수락 실패");
        return;
      }

      alert("친구 요청 수락 완료");

      // 수락한 요청은 요청 목록에서 제거
      setRequests((prev) => prev.filter((r) => r.id !== requestId));

      // 친구 목록 갱신
      const friendRes = await fetch(`${SERVER_URL}/api/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (friendRes.ok) {
        const friendData = await friendRes.json();
        setFriends(friendData);
      }
    } catch (err) {
      console.error("친구 수락 에러:", err);
      alert("친구 수락 중 오류가 발생했습니다.");
    }
  };

  // 친구 요청 거절
  const handleReject = async (requestId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`${SERVER_URL}/api/friends/reject/${requestId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("친구 요청 거절 실패");
        return;
      }

      alert("친구 요청 거절 완료");

      // 거절한 요청 목록에서 제거
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("친구 요청 거절 에러:", err);
      alert("친구 요청 거절 중 오류가 발생했습니다.");
    }
  };

  // 친구 삭제 (예시 - 삭제 API 호출 필요하면 추가 구현)
  const handleDelete = async (friend) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const email = typeof friend === "string" ? friend : friend.email;

      const res = await fetch(`${SERVER_URL}/api/friends/${email}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("친구 삭제 실패");
        return;
      }

      alert("친구 삭제 완료");

      // 삭제한 친구 목록에서 제거
      setFriends((prev) =>
        prev.filter((f) =>
          typeof f === "string" ? f !== email : f.email !== email
        )
      );
    } catch (err) {
      console.error("친구 삭제 에러:", err);
      alert("친구 삭제 중 오류가 발생했습니다.");
    }
  };

  const goToAddFriend = () => {
    navigate("/add-friend");
  };

  return (
    <div className="FriendPage">
      <Header />
      <div className="FriendContent">
        <div className="RequestBox">
          <div className="request-title">받은 요청</div>
          <ul className="request-list">
            {requests.map((r, i) => (
              <FriendRequestItem
                key={i}
                name={`${r.name} - ${r.email}`}
                onAccept={() => handleAccept(r.id)}
                onReject={() => handleReject(r.id)}
              />
            ))}
          </ul>
        </div>

        <div className="FriendListBox">
          <div className="friend-header">
            <div className="friend-title">친구</div>
            <button className="add-button" onClick={goToAddFriend}>
              친구 추가
            </button>
          </div>
          <div className="friend-count">{friends.length}명</div>

          <ul className="friend-list">
            {friends.map((f, i) => {
              const displayName =
                typeof f === "string" ? f : `${f.name} - ${f.email}`;
              return (
                <FriendItem
                  key={i}
                  name={displayName}
                  onDelete={() => handleDelete(f)}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Friends;

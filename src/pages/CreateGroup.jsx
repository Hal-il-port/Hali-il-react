import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SERVER_URL from "../config/server";
import "./CreateGroup.css";

const CreateGroup = () => {
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailKeyword, setEmailKeyword] = useState("");
  const [emailResults, setEmailResults] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;

    const fetchFriends = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error("친구 목록 요청 실패:", err);
      }
    };

    fetchFriends();
  }, [token]);

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = () => {
    if (groupName.trim() === "") {
      alert("그룹 이름을 입력해주세요!");
      return;
    }
    if (selected.length === 0) {
      alert("최소 1명의 그룹원을 선택해주세요!");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsModalOpen(false);
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const payload = {
      name: groupName.trim(),
      userIds: selected,
    };
    console.log(payload);

    try {
      const res = await fetch(`${SERVER_URL}/api/teams/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert(`그룹 생성 실패: ${res.status}`);
        return;
      }

      alert("그룹이 성공적으로 생성되었습니다.");
      navigate("/groups");
    } catch (err) {
      console.error("그룹 생성 중 오류:", err);
      alert("그룹 생성 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const searchUsers = async () => {
    if (!token || emailKeyword.trim() === "") return;

    try {
      const res = await fetch(
        `${SERVER_URL}/api/teams/search-users?keyword=${encodeURIComponent(
          emailKeyword.trim()
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        console.error("유저 검색 실패:", res.status);
        return;
      }

      const data = await res.json();
      setEmailResults(data);
    } catch (err) {
      console.error("유저 검색 요청 중 오류:", err);
    }
  };

  return (
    <div className="CreateGroupPage">
      <Header />
      <div className="CreateGroupContent">
        <div className="header-row">
          <h2>그룹 만들기</h2>
          <button className="create-button" onClick={handleCreateGroup}>
            그룹 만들기
          </button>
        </div>

        <input
          className="Group-Name"
          placeholder="그룹 이름"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* ✅ 이메일 검색 입력창 */}
        <div className="email-invite-section">
          <input
            className="Email-Search"
            placeholder="이메일로 초대할 사용자 검색"
            value={emailKeyword}
            onChange={(e) => setEmailKeyword(e.target.value)}
          />
          <button className="search-button" onClick={searchUsers}>
            검색
          </button>
        </div>

        {/* ✅ 이메일 검색 결과 */}
        <ul className="email-search-results">
          {emailResults.map(({ id, name, email }) => (
            <li key={id} className="user-item">
              <input
                type="checkbox"
                checked={selected.includes(id)}
                onChange={() => toggleSelection(id)}
              />
              <span>
                {name} - {email}
              </span>
            </li>
          ))}
        </ul>

        {/* ✅ 친구 목록 */}
        <ul className="user-list">
          {friends.map(({ id, name, email }) => (
            <li key={id} className="user-item">
              <input
                type="checkbox"
                checked={selected.includes(id)}
                onChange={() => toggleSelection(id)}
              />
              <span>
                {name} - {email}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ 확인 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>선택한 친구들과 그룹을 만드시겠어요?</p>
            <div className="modal-buttons">
              <button onClick={handleConfirm}>확인</button>
              <button onClick={handleCancel}>아니요</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroup;

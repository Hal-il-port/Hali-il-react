import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import SERVER_URL from "../config/server";
import "./manageGroup.css";

const ManageGroup = () => {
  const { teamId } = useParams();
  const token = localStorage.getItem("accessToken");

  const [teamDetail, setTeamDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [searchResult, setSearchResult] = useState([]); // 배열로 초기화
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchTeamDetail = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("팀 상세 조회 실패:", res.status);
          return;
        }
        const data = await res.json();
        setTeamDetail(data);
      } catch (err) {
        console.error("팀 상세 조회 중 오류:", err);
      }
    };

    fetchTeamDetail();
  }, [teamId, token]);

  useEffect(() => {
    if (!isModalOpen || !token) return;

    const fetchFriendList = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("친구 목록 불러오기 실패:", res.status);
          return;
        }
        const data = await res.json();
        setFriendList(data);
      } catch (err) {
        console.error("친구 목록 요청 중 오류:", err);
      }
    };

    fetchFriendList();
    setSearchResult([]); // 빈 배열로 초기화
    setSelectedFriends([]);
    setSearchEmail("");
  }, [isModalOpen, token]);

  const handleSearchByEmail = async () => {
    if (!searchEmail.trim()) return;

    try {
      const res = await fetch(
        `${SERVER_URL}/api/teams/search-users?keyword=${encodeURIComponent(
          searchEmail.trim()
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error("검색 실패 응답:", errText);
        alert(`이메일 검색 실패: ${res.status}`);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setSearchResult(data);
      } else {
        setSearchResult([]);
      }
    } catch (err) {
      console.error("이메일 검색 중 오류:", err);
      alert("이메일 검색 중 오류 발생");
    }
  };

  const toggleFriendSelection = (friend) => {
    setSelectedFriends((prev) => {
      const isSelected = prev.some(
        (f) => String(f.userId) === String(friend.id)
      );
      if (isSelected) {
        return prev.filter((f) => String(f.userId) !== String(friend.id));
      } else {
        return [...prev, { userId: friend.id, email: friend.email }];
      }
    });
  };

  const handleInvite = async () => {
    if (selectedFriends.length === 0) {
      alert("초대할 친구를 선택해주세요.");
      return;
    }
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const userIds = selectedFriends.map((f) => f.userId);
    const payload = {
      teamId: Number(teamId),
      userIds: userIds,
    };

    console.log("초대 요청 payload:", payload);

    try {
      const res = await fetch(`${SERVER_URL}/api/teams/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("초대 실패 응답:", errText);
        alert(`초대 실패: ${res.status}`);
        return;
      }

      alert("초대가 성공적으로 전송되었습니다.");

      setIsModalOpen(false);
      setSelectedFriends([]);
      setSearchResult([]);
      setSearchEmail("");
    } catch (error) {
      console.error("초대 중 오류:", error);
      alert("초대 중 오류가 발생했습니다.");
    }
  };

  if (!teamDetail) return <div>로딩중...</div>;

  const leader = teamDetail.members?.find((m) => m.role === "LEADER");
  const members = teamDetail.members?.filter((m) => m.role !== "LEADER") ?? [];

  return (
    <div>
      <Header />
      <div className="ManageGroupPage">
        <h2>그룹명: {teamDetail.name}</h2>
        <p>생성일: {new Date(teamDetail.createdAt).toLocaleString()}</p>
        <div className="add-member-button-box">
          <button
            className="add-member-button"
            onClick={() => setIsModalOpen(true)}
          >
            그룹원 추가
          </button>
        </div>

        <div className="member-list">
          <h3>팀 리더</h3>
          {leader ? (
            <div className="member-item leader">
              <span>{leader.name}</span> - <span>{leader.role}</span>
            </div>
          ) : (
            <p>팀 리더 정보가 없습니다.</p>
          )}

          <h3>팀 멤버</h3>
          {members.length === 0 ? (
            <p>팀 멤버가 없습니다.</p>
          ) : (
            members.map((m) => (
              <div key={m.userId} className="member-item">
                <span>{m.name}</span> - <span>{m.role}</span>
              </div>
            ))
          )}
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>그룹원 추가</h2>

              <div className="emailcontainer">
                <label htmlFor="searchEmail">이메일로 검색</label>
                <input
                  id="searchEmail"
                  type="text"
                  placeholder="이메일을 입력하세요"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
                <button className="searchbtn" onClick={handleSearchByEmail}>
                  검색
                </button>
              </div>

              <h3>친구 목록</h3>
              {friendList.length === 0 ? (
                <p>친구 목록이 없습니다.</p>
              ) : (
                <ul className="friend-list">
                  {friendList.map((friend) => (
                    <li key={friend.id} className="friend-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedFriends.some(
                            (f) => String(f.userId) === String(friend.id)
                          )}
                          onChange={() => toggleFriendSelection(friend)}
                        />
                        {friend.name} ({friend.email})
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              {/* 검색 결과가 배열이고 0 이상일 때만 렌더링 */}
              {Array.isArray(searchResult) && searchResult.length > 0 && (
                <>
                  <h3>검색 결과</h3>
                  <ul className="friend-list">
                    {searchResult.map((user) => (
                      <li key={user.id} className="friend-item">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedFriends.some(
                              (f) => String(f.userId) === String(user.id)
                            )}
                            onChange={() => toggleFriendSelection(user)}
                          />
                          {user.name} ({user.email})
                        </label>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="modal-buttons">
                <button onClick={() => setIsModalOpen(false)}>취소</button>
                <button onClick={handleInvite}>초대</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageGroup;

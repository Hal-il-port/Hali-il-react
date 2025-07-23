import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SERVER_URL from "../config/server";
import "./Group.css";

const Groups = () => {
  const navigate = useNavigate();

  const [invitations, setInvitations] = useState([]);
  const [myGroups, setMyGroups] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;

    const fetchInvitations = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/teams/invitations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          console.error("초대 목록 불러오기 실패:", res.status);
          return;
        }
        const data = await res.json();
        setInvitations(data);
      } catch (err) {
        console.error("초대 목록 요청 중 오류:", err);
      }
    };

    const fetchMyGroups = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/teams/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          console.error("내 그룹 목록 불러오기 실패:", res.status);
          return;
        }
        const data = await res.json();
        console.log("받은 그룹 리스트:", data);
        setMyGroups(data);
      } catch (err) {
        console.error("내 그룹 목록 요청 중 오류:", err);
      }
    };

    fetchInvitations();
    fetchMyGroups();
  }, [token]);

  const handleAccept = async (invite) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(
        `${SERVER_URL}/api/teams/invitations/${invite.invitationId}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        alert(`초대 수락 실패: ${res.status}`);
        return;
      }

      alert(`${invite.teamName} 초대를 수락했습니다.`);

      setInvitations((prev) =>
        prev.filter((i) => i.invitationId !== invite.invitationId)
      );

      const updatedGroups = await fetch(`${SERVER_URL}/api/teams/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (updatedGroups.ok) {
        const newGroupList = await updatedGroups.json();
        setMyGroups(newGroupList);
      }
    } catch (err) {
      console.error("초대 수락 오류:", err);
      alert("초대 수락 중 오류가 발생했습니다.");
    }
  };

  const handleReject = (invite) => alert(`${invite.teamName} 초대 거절`);

  const handleLeaveGroup = (groupName) => alert(`${groupName} 그룹 나가기`);

  const goToCreateGroup = () => navigate("/create-group");

  // 그룹 클릭 시 상세 페이지로 이동
  const goToGroupPage = (groupId) => {
    navigate(`/manageGroup/${groupId}`);
  };

  return (
    <div className="GroupsPage">
      <Header />
      <div className="GroupsContainer">
        <div className="GroupsContent">
          {/* 초대 요청 목록 */}
          <div className="RequestBox">
            <div className="request-title">받은 요청</div>
            {invitations.length === 0 ? (
              <p className="no-invites">받은 초대 요청이 없습니다.</p>
            ) : (
              <ul className="request-list">
                {invitations.map((invite) => (
                  <li
                    key={
                      invite.invitationId ??
                      `${invite.teamId}-${invite.fromUserName}`
                    }
                    className="request-item"
                  >
                    <span>
                      {invite.teamName} - 초대자: {invite.fromUserName}
                    </span>
                    <div className="request-actions">
                      <button
                        className="accept-button"
                        onClick={() => handleAccept(invite)}
                      >
                        ✔
                      </button>
                      <button
                        className="reject-button"
                        onClick={() => handleReject(invite)}
                      >
                        ✖
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 그룹 목록 */}
          <div className="GroupListBox">
            <div className="group-list-header">
              <div className="group-title">그룹 목록</div>
              <button className="GroupAddButton" onClick={goToCreateGroup}>
                그룹 추가
              </button>
            </div>

            <ul className="group-list">
              {myGroups.length === 0 ? (
                <p className="no-groups">가입된 그룹이 없습니다.</p>
              ) : (
                myGroups.map((group) => (
                  <li
                    key={group.id} // 🔄 수정: group.teamId → group.id
                    className="group-item"
                    onClick={() => goToGroupPage(group.id)} // 🔄 수정: group.teamId → group.id
                    style={{ cursor: "pointer" }}
                  >
                    <div className="group-item">
                      <span className="group-name clickable">{group.name}</span>
                      <button
                        className="leave-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveGroup(group.name);
                        }}
                      >
                        나가기
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;

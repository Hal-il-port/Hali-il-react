import React, { useRef, useState, useEffect } from "react";
import ScheduleItem from "./ScheduleItem";
import Button from "./Button";
import "./ScheduleList.css";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import Editor from "./Editor";
import SERVER_URL from "../config/server";

const STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
};

const ScheduleList = () => {
  const personalRef = useRef(null);
  const groupRef = useRef(null);
  const [dividerHeight, setDividerHeight] = useState(0);

  const [showPersonalEditor, setShowPersonalEditor] = useState(false);
  const [showGroupEditor, setShowGroupEditor] = useState(false);

  const [personalSchedules, setPersonalSchedules] = useState([]);
  const [groupSchedules, setGroupSchedules] = useState([]);

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const today = new Date();
  const formattedDate = format(today, "yyyy년 MM월 dd일 EEEE", { locale: ko });

  const token = localStorage.getItem("accessToken");

  const fetchPersonalSchedules = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/schedules/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error("개인 일정 불러오기 실패");
        return;
      }
      const data = await res.json();
      setPersonalSchedules(data);
    } catch (err) {
      console.error("개인 일정 요청 에러:", err);
    }
  };

  const fetchGroups = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/teams/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error("그룹 목록 불러오기 실패");
        return;
      }
      const data = await res.json();
      setGroups(data);
      if (data.length > 0 && !selectedGroupId) {
        setSelectedGroupId(data[0].id);
      }
    } catch (err) {
      console.error("그룹 목록 요청 실패:", err);
    }
  };

  const fetchGroupSchedules = async () => {
    if (!token || !selectedGroupId) {
      setGroupSchedules([]);
      return;
    }
    try {
      const res = await fetch(
        `${SERVER_URL}/api/schedules/team/${selectedGroupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        console.error("그룹 일정 불러오기 실패");
        setGroupSchedules([]);
        return;
      }
      const data = await res.json();
      setGroupSchedules(data);
    } catch (err) {
      console.error("그룹 일정 요청 실패:", err);
      setGroupSchedules([]);
    }
  };

  useEffect(() => {
    fetchPersonalSchedules();
  }, [token]);

  useEffect(() => {
    fetchGroups();
  }, [token]);

  useEffect(() => {
    fetchGroupSchedules();
  }, [token, selectedGroupId]);

  // ✅ 그룹 + 개인 일정 동기화용
  const softRefreshAll = async () => {
    await fetchGroups();
    await fetchPersonalSchedules();
    await fetchGroupSchedules();
  };

  // ✅ 개인 일정 추가
  const handleAddPersonal = async (item) => {
    if (!token) return;
    const body = {
      content: item.content,
      dueDate: item.deadline,
      status: STATUS.IN_PROGRESS,
      teamId: null,
      type: "PERSONAL",
    };

    try {
      const res = await fetch(`${SERVER_URL}/api/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert("개인 일정 추가 실패: " + errorText);
        return;
      }

      await softRefreshAll(); // 🔥 수정됨
      setShowPersonalEditor(false);
    } catch (err) {
      console.error("개인 일정 추가 에러:", err);
      alert("개인 일정 추가 중 오류 발생");
    }
  };

  // ✅ 개인 일정 삭제
  const handleDeletePersonal = async (id) => {
    if (!token) return;

    try {
      const res = await fetch(`${SERVER_URL}/api/schedules/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert("삭제 실패");
        return;
      }

      await softRefreshAll(); // 🔥 수정됨
    } catch (err) {
      console.error("일정 삭제 에러:", err);
    }
  };

  // ✅ 개인 일정 상태 토글
  const handleTogglePersonal = async (item) => {
    if (!token) return;

    try {
      const newStatus =
        item.status === STATUS.DONE ? STATUS.IN_PROGRESS : STATUS.DONE;
      const updatedItem = { ...item, status: newStatus };

      const res = await fetch(`${SERVER_URL}/api/schedules/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });

      if (!res.ok) {
        alert("상태 변경 실패");
        return;
      }

      await softRefreshAll(); // 🔥 수정됨
    } catch (err) {
      console.error("상태 변경 에러:", err);
    }
  };

  // ✅ 그룹 일정 관련 함수들
  const handleAddGroup = async (item) => {
    if (!token) return;

    const body = {
      content: item.content,
      dueDate: item.deadline,
      status: STATUS.IN_PROGRESS,
      type: "TEAM",
      teamId: selectedGroupId,
    };

    try {
      const res = await fetch(`${SERVER_URL}/api/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert("그룹 일정 추가 실패: " + errorText);
        return;
      }

      await softRefreshAll();
      setShowGroupEditor(false);
    } catch (err) {
      console.error("그룹 일정 추가 에러:", err);
      alert("그룹 일정 추가 중 오류 발생");
    }
  };

  const handleToggleGroup = async (item) => {
    if (!token) return;

    try {
      const newStatus =
        item.status === STATUS.DONE ? STATUS.IN_PROGRESS : STATUS.DONE;
      const updatedItem = { ...item, status: newStatus };

      const res = await fetch(`${SERVER_URL}/api/schedules/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });

      if (!res.ok) {
        alert("상태 변경 실패");
        return;
      }

      await softRefreshAll();
    } catch (err) {
      console.error("상태 변경 에러:", err);
    }
  };

  const handleDeleteGroup = async (id) => {
    if (!token) return;

    try {
      const res = await fetch(`${SERVER_URL}/api/schedules/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert("삭제 실패");
        return;
      }

      await softRefreshAll();
    } catch (err) {
      console.error("일정 삭제 에러:", err);
    }
  };

  const handleGroupChange = (e) => {
    setSelectedGroupId(Number(e.target.value));
  };

  useEffect(() => {
    const personalHeight = personalRef.current?.offsetHeight || 0;
    const groupHeight = groupRef.current?.offsetHeight || 0;
    const maxHeight = Math.max(personalHeight, groupHeight);
    setDividerHeight(maxHeight + 20);
  }, [personalSchedules, groupSchedules, showPersonalEditor, showGroupEditor]);

  return (
    <div className="ScheduleListContainer">
      <h4 className="date-title">{formattedDate}</h4>

      <div className="select-row">
        <select onChange={handleGroupChange} value={selectedGroupId || ""}>
          <option value="" disabled>
            그룹 선택
          </option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="items-row">
        <div className="Personal_area" ref={personalRef}>
          <h3>개인 일정</h3>
          {personalSchedules.map((item) => (
            <ScheduleItem
              key={item.id}
              content={item.content}
              end_datetime={
                item.dueDate ? format(parseISO(item.dueDate), "MM/dd") : ""
              }
              isDone={item.status === STATUS.DONE}
              onDelete={() => handleDeletePersonal(item.id)}
              onToggle={() => handleTogglePersonal(item)}
            />
          ))}

          {!showPersonalEditor ? (
            <Button
              className="Add_Schedule"
              type="LOGIN"
              text="추가하기"
              onClick={() => setShowPersonalEditor(true)}
            />
          ) : (
            <Editor
              label="개인용"
              onAdd={handleAddPersonal}
              onCancel={() => setShowPersonalEditor(false)}
            />
          )}
        </div>

        <div
          className="vertical-divider"
          style={{ height: dividerHeight ? `${dividerHeight}px` : "0" }}
        />

        <div className="Group_area" ref={groupRef}>
          <h3>그룹 일정</h3>
          {groupSchedules.map((item) => (
            <ScheduleItem
              key={item.id}
              {...item}
              name={item.author || "알 수 없음"}
              end_datetime={
                item.dueDate ? format(parseISO(item.dueDate), "MM/dd") : ""
              }
              isDone={item.status === STATUS.DONE}
              onDelete={() => handleDeleteGroup(item.id)}
              onToggle={() => handleToggleGroup(item)}
            />
          ))}

          {!showGroupEditor ? (
            <Button
              className="Add_Schedule"
              type="LOGIN"
              text="추가하기"
              onClick={() => setShowGroupEditor(true)}
            />
          ) : (
            <Editor
              label="그룹용"
              onAdd={handleAddGroup}
              onCancel={() => setShowGroupEditor(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;

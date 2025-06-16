import React, { useRef, useState, useEffect } from 'react';
import ScheduleItem from './ScheduleItem';
import Button from './Button';
import './ScheduleList.css';
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Editor from './Editor';

const ScheduleList = () => {
  const personalRef = useRef(null);
  const groupRef = useRef(null);
  const [dividerHeight, setDividerHeight] = useState(0);

  const [showPersonalEditor, setShowPersonalEditor] = useState(false);
  const [showGroupEditor, setShowGroupEditor] = useState(false);

  const [personalSchedules, setPersonalSchedules] = useState([
    { content: "개인 일정 A", end_datetime: "06/16" },
    { content: "개인 일정 B", end_datetime: "06/17" },
    { content: "개인 일정 C", end_datetime: "06/18" }
  ]);

  const [groupSchedules, setGroupSchedules] = useState([
    { name: "양준민", content: "그룹 일정 A", end_datetime: "06/19" },
    { name: "양준민", content: "그룹 일정 B", end_datetime: "06/20" },
    { name: "양준민", content: "그룹 일정 C", end_datetime: "06/21" }
  ]);

  const handleAddPersonal = (item) => {
    setPersonalSchedules(prev => [...prev, item]);
    setShowPersonalEditor(false);
  };

  const handleAddGroup = (item) => {
    setGroupSchedules(prev => [...prev, item]);
    setShowGroupEditor(false);
  };

  useEffect(() => {
    const personalHeight = personalRef.current?.offsetHeight || 0;
    const groupHeight = groupRef.current?.offsetHeight || 0;
    const maxHeight = Math.max(personalHeight, groupHeight);
    setDividerHeight(maxHeight + 20);
  }, [personalSchedules, groupSchedules, showPersonalEditor, showGroupEditor]);

  const today = new Date();
  const formattedDate = format(today, "yyyy년 MM월 dd일 EEEE", { locale: ko });

  return (
    <div className="ScheduleListContainer">
      <h4 className="date-title">{formattedDate}</h4>

      <div className="select-row">
        <select>
          <option>그룹 선택</option>
          <option>그룹1</option>
          <option>그룹2</option>
          <option>그룹3</option>
          <option>그룹4</option>
        </select>
      </div>

      <div className="items-row">
        <div className="Personal_area" ref={personalRef}>
          <h3>개인 일정</h3>
          {personalSchedules.map((item, idx) => (
            <ScheduleItem
              key={idx}
              {...item}
              onDelete={() => {
                setPersonalSchedules(prev => prev.filter((_, i) => i !== idx));
              }}
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
        ></div>

        <div className="Group_area" ref={groupRef}>
          <h3>그룹 일정</h3>
          {groupSchedules.map((item, idx) => (
            <ScheduleItem
              key={idx}
              {...item}
              onDelete={() => {
                setGroupSchedules(prev => prev.filter((_, i) => i !== idx));
              }}
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

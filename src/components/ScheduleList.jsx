import React, { useRef, useState, useEffect } from 'react';
import ScheduleItem from './ScheduleItem';
import Button from './Button';
import './ScheduleList.css';

const ScheduleList = () => {
  const personalRef = useRef(null);
  const groupRef = useRef(null);
  const [dividerHeight, setDividerHeight] = useState(0);

  useEffect(() => {
    const personalHeight = personalRef.current?.offsetHeight || 0;
    const groupHeight = groupRef.current?.offsetHeight || 0;
    const maxHeight = Math.max(personalHeight, groupHeight);
    setDividerHeight(maxHeight + 20); // 더 긴 쪽 +20px
  }, []);

  return (
    <div className="ScheduleListContainer">
      <h4 className="date-title">06-07</h4>

      <div className="select-row">
        <select>
          <option>그룹1</option>
          <option>그룹2</option>
          <option>그룹3</option>
          <option>그룹4</option>
        </select>
      </div>

      <div className="items-row">
        <div className="Personal_area" ref={personalRef}>
          personal
          <ScheduleItem label="개인용" />
          <ScheduleItem label="개인용" />
          <ScheduleItem label="개인용" />
          <Button
            className="Add_Schedule"
            type={"LOGIN"}
            text={"추가하기"}
          />
        </div>

        <div
          className="vertical-divider"
          style={{ height: dividerHeight ? `${dividerHeight}px` : "0" }}
        ></div>

        <div className="Group_area" ref={groupRef}>
          group
          <ScheduleItem label="그룹용1" />
          <ScheduleItem label="그룹용2" />
          <Button
            className="Add_Schedule"
            type={"LOGIN"}
            text={"추가하기"}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;

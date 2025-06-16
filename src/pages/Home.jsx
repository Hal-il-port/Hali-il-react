import Header from "../components/Header";
import ScheduleList from "../components/ScheduleList";
import CustomCalendar from "../components/Calendar";
import "./Home.css";
import { useState } from "react";

const Home = () => {
  const [showCalendar, setShowCalendar] = useState(false); // 달력 표시 상태

  const toggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };

  return (
    <div>
      <Header />

      <div className="MainContent">
        <div className="CalendarWrapper" style={{ display: showCalendar ? "block" : "none" }}>
          <CustomCalendar />
        </div>

        <button className="open_hide" onClick={toggleCalendar}>
          {showCalendar ? "숨기기" : "열기"}
        </button>

        <div className="ScheduleWrapper">
          <ScheduleList />
        </div>
      </div>
    </div>
  );
};

export default Home;
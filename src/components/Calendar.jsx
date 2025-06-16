import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';
import { getHolidays } from '../utils/getHolidays';

const CustomCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [holidayList, setHolidayList] = useState([]);
  const [activeDate, setActiveDate] = useState(new Date()); // 달력 상단의 현재 표시 중인 날짜 (달 변경용)

  const loadHolidays = async (year, month) => {
    const holidays = await getHolidays(year, month);
    console.log(`📅 ${year}년 ${month}월 공휴일:`, holidays);
    setHolidayList(holidays);
  };

  // 최초 로드 또는 표시 중인 달이 바뀔 때
  useEffect(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth() + 1;
    loadHolidays(year, month);
  }, [activeDate]);

  return (
    <div>
      <Calendar
        className="frame"
        onChange={setValue}
        value={value}
        locale="ko"
        calendarType="gregory"
        onActiveStartDateChange={({ activeStartDate }) => {
          setActiveDate(activeStartDate);
        }}
        tileClassName={({ date }) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        const yyyymmdd = `${year}${month}${day}`;
        return holidayList.includes(Number(yyyymmdd)) ? 'holiday' : null;
        }}

      />
      <div style={{ marginTop: '1rem' }}>
        해당 날짜에 개인 일정은 노란색 선
        그룹 일정은 초록색 선으로 표시됩니다.
      </div>
    </div>
  );
};

export default CustomCalendar;

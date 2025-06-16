import { useState } from "react";
import "./Editor.css";
import { format, addDays } from "date-fns";

const Editor = ({ onAdd, onCancel, label }) => {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleAdd = () => {
    if (!text || !deadline) return alert("내용과 날짜를 입력해주세요!");

    const newItem = {
      content: text,
      end_datetime: deadline,
      status: false,
      ...(label !== "개인용" && { name: "양준민" }),
    };

    onAdd(newItem); // 부모에게 데이터 전달
    setText("");
    setDeadline("");
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i <= 30; i++) {
      const date = addDays(today, i);
      dates.push(format(date, "MM/dd"));
    }
    return dates;
  };

  return (
    <div className="Editor">
      <input
        placeholder="일정 혹은 할일을 적으세요"
        className="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <select
        className="finish_line"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      >
        <option value="">마감 날짜</option>
        {generateDates().map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <div className="button_wrapper">
        <button className="add" onClick={handleAdd}>추가하기</button>
        <button className="cancel" onClick={onCancel}>취소하기</button>
      </div>
    </div>
  );
};

export default Editor;

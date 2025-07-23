import React, { useState } from "react";
import "./Editor.css";

const Editor = ({ onAdd, onCancel, label }) => {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleAdd = async () => {
    if (!text || !deadline) {
      alert("내용과 날짜를 입력해주세요");
      return;
    }

    try {
      await onAdd({ content: text, deadline });
      setText("");
      setDeadline("");
    } catch (error) {
      alert("일정 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="Editor">
      <label>
        {label} 내용
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="일정 내용을 입력하세요"
        />
      </label>
      <label>
        마감 날짜
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </label>

      {/* 버튼을 가로로 배치 */}
      <div className="button_wrapper">
        <button className="add" onClick={handleAdd}>
          추가하기
        </button>
        <button className="cancel" onClick={onCancel}>
          취소
        </button>
      </div>
    </div>
  );
};

export default Editor;

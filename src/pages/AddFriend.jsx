import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import Header from "../components/Header";
import "./AddFriend.css";
import SERVER_URL from "../config/server";

const AddFriend = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // ✅ 추가

  const handleAdd = async () => {
    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인 토큰이 없습니다. 다시 로그인 해주세요.");
      return;
    }

    try {
      const res = await fetch(`${SERVER_URL}/api/friends/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        alert(`이메일 ${email}로 친구 요청을 보냈습니다.`);
        setEmail("");
        navigate("/friends"); // ✅ 친구 관리 화면으로 이동
      } else {
        alert("친구 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("친구 추가 에러:", error);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <div className="AddFriendPage">
        <div className="AddFriendContent">
          <p className="instruction">
            친구의 이메일을 입력해 친구 목록에 추가해 보세요!
          </p>
          <input
            type="email"
            className="email-input"
            placeholder="abc123@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="add-button" onClick={handleAdd}>
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;

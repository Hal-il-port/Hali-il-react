import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mypage from "./pages/Mypage";
import Notfound from "./pages/Notfound";
import Friends from "./pages/friends";
import Groups from "./pages/Groups";
import Board from "./pages/Board";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Mypage" element={<Mypage />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/Groups" element={<Groups/>} />
        <Route path="/Board" element={<Board/>} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  )
}

export default App

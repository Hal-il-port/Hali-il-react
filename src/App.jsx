import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mypage from "./pages/Mypage";
import Notfound from "./pages/Notfound";
import Groups from "./pages/Groups";
import Friends from "./pages/Friends";
import AddFriend from "./pages/AddFriend";
import CreateGroup from "./pages/CreateGroup";
import ManageGroup from "./pages/manageGroup";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/add-friend" element={<AddFriend />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/manageGroup/:teamId" element={<ManageGroup />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;

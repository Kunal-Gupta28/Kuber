import { Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import UserLogout from "./pages/UserLogout";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignUp from "./pages/CaptainSignUp";
import UserProtectorWrapper from "./pages/UserProtectWrapper";
import CaptainProtectWrapper from "./pages/captainProtectWrapper";
import Riding from "./components/Riding";
import CaptainHome from "./pages/CaptainHome";
import CaptainRiding from "./pages/CaptainRiding";
import CaptainLogout from "./pages/CaptainLogout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route
          path="/home"
          element={
            <UserProtectorWrapper>
              {" "}
              <Home />{" "}
            </UserProtectorWrapper>
          }
        />
        <Route path="/users/login" element={<UserLogin />} />
        <Route path="/users/riding" element={<Riding />} />
        <Route path="/users/register" element={<UserSignUp />} />

        <Route
          path="users/logout"
          element={
            <UserProtectorWrapper>
              <UserLogout />
            </UserProtectorWrapper>
          }
        />
        <Route path="/captains/login" element={<CaptainLogin />} />
        <Route path="/captains/register" element={<CaptainSignUp />} />
        <Route
          path="/captains/home"
          element={
            <CaptainProtectWrapper>
              <CaptainHome />
            </CaptainProtectWrapper>
          }
        />
        <Route path="/captains/riding" element={<CaptainRiding />} />
        <Route
          path="/captain/logout"
          element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          }
        />
      </Routes>
    </>
  );
}

export default App;

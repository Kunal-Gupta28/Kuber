import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Start from "./pages/Start";
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import UserLogout from "./pages/UserLogout";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignUp from "./pages/CaptainSignUp";
import UserProtectorWrapper from "./pages/UserProtectWrapper";
import CaptainProtectWrapper from "./pages/captainProtectWrapper";
import Riding from "./pages/Riding";
import CaptainHome from "./pages/CaptainHome";
import CaptainRiding from "./pages/CaptainRiding";
import CaptainLogout from "./pages/CaptainLogout";
import { Toaster } from "react-hot-toast";
import UserProfile from "./components/UserProfile";
import CaptainProfile from "./components/CaptainProfile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/users/register" element={<UserSignUp />} />
        <Route path="/users/login" element={<UserLogin />} />
        <Route
          path="/home"
          element={
            <UserProtectorWrapper>
              <Home />
            </UserProtectorWrapper>
          }
        />
        <Route path="/users/profile" element={<UserProfile />} />
        <Route path="/users/riding" element={<Riding />} />
        <Route
          path="/users/logout"
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
        <Route path="/captains/profile" element={<CaptainProfile />} />
        <Route path="/captains/riding" element={<CaptainRiding />} />
        <Route
          path="/captain/logout"
          element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          }
        />

        <Route path="*" element={<NotFound/>}/>
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 10000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            duration: 10000,
            theme: {
              primary: "#4aed88",
            },
          },
          error: {
            duration: 10000,
            theme: {
              primary: "#ff4b4b",
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import CaptainContextProvider from "./context/CaptainContext.jsx";
import {SocketProvider} from "./context/socketContext.jsx";
import { RideContextProvider } from "./context/RideContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CaptainContextProvider>
      <UserContext>
        <SocketProvider>
          <RideContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </RideContextProvider>
        </SocketProvider>
      </UserContext>
    </CaptainContextProvider>
  </StrictMode>
);

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProtectorWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log(token);
  
  useEffect(() => {
    if (!token) {
      navigate("/users/login");
    }
  }, [token]);

  return <>{children}</>;
};

export default UserProtectorWrapper;

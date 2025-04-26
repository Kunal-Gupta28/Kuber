import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        navigate("/users/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      navigate("/users/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black"
    >
      <i className="ri-logout-box-r-line"></i>
    </button>
  );
};

export default UserLogout;

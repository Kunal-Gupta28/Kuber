import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const NavBar = ({ user, isCaptain = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  useGSAP(() => {
    gsap.to(menuRef.current, {
      opacity: isMenuOpen ? 1 : 0,
      y: isMenuOpen ? 0 : -100,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(isCaptain ? "/captains/login" : "/users/login");
  };

  return (
    <nav className="w-full px-4 py-2 flex justify-between items-center text-xl z-20 absolute top-0">
      <h2 className="font-bold text-gray-900 text-2xl">Kuber</h2>
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <i className="ri-menu-line text-2xl font-bold text-gray-900"></i>
        </button>

        {/* Dropdown Menu */}
        <div
          ref={menuRef}
          className={`absolute right-0 mt-3 w-52 origin-top-right rounded-xl shadow-xl bg-white dark:bg-gray-800 transform transition-all duration-300 z-30 ${
            isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <i className="ri-user-line text-gray-600 dark:text-gray-400"></i>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.name || (isCaptain ? 'Captain' : 'User')}
              </span>
            </div>
          </div>
          
          <div className="px-4 py-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <i className={`ri-${isDarkMode ? 'sun' : 'moon'}-line`}></i>
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          <div className="px-4 py-2">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
            >
              <i className="ri-logout-box-r-line"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 
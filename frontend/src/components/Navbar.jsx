import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const NavBar = ({ user, isCaptain = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuTl = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  useGSAP(() => {
    menuTl.current = gsap.timeline({ paused: true })
      .fromTo(
        menuRef.current,
        {
          opacity: 0,
          scale: 0.95,
          y: -10,
          pointerEvents: "none",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          pointerEvents: "auto",
          duration: 0.3,
          ease: "power2.out",
        }
      );
  }, []);

  useEffect(() => {
    if (menuTl.current) {
      isMenuOpen ? menuTl.current.play() : menuTl.current.reverse();
    }
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

                  {/* Close Button */}
                  <div className="flex justify-end px-4 py-2 absolute top-0 right-0">
            <button onClick={() => setIsMenuOpen(false)}>
              <i className="ri-close-line text-xl text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"></i>
            </button>
          </div>

        <div
          ref={menuRef}
          className="absolute right-0 top-[1%] w-52 origin-top-right rounded-xl shadow-xl bg-white dark:bg-gray-800 z-30"
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
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
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

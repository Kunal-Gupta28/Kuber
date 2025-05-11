import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useCaptainContext } from "../context/CaptainContext";

const NavBar = ({userType}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuTl = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useUserContext();
  const { captain } = useCaptainContext();
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.closest('button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(userType==="user" ? "/users/login" : "/captains/login");
  };

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    navigate(userType==="user" ? "/users/profile" : "/captains/profile");
  };

  return (
    <nav className="w-full px-6 py-3 flex justify-between items-center text-xl z-50 fixed top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-2">
        <h2 className="font-bold text-gray-900 dark:text-white text-2xl">Kuber</h2>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
          aria-label="Toggle menu"
        >
          <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl font-bold text-gray-900 dark:text-white`}></i>
        </button>

        <div
          ref={menuRef}
          className={`absolute right-0 mt-3 w-72 origin-top-right rounded-xl shadow-xl bg-white dark:bg-gray-800 z-50 transform transition-all duration-200 ${
            isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden ring-2 ring-blue-500 dark:ring-blue-400">
                {(user?.image || captain?.image) ? (
                  <img
                    src={user?.image || captain?.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="ri-user-line text-2xl text-gray-600 dark:text-gray-400"></i>
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-lg text-gray-900 dark:text-white">
                  {user?.fullname?.firstname + " " + user?.fullname?.lastname || 
                   captain?.fullname?.firstname + " " + captain?.fullname?.lastname}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {user ? 'View Profile' : 'View Captain Profile'}
                </span>
              </div>
            </button>
          </div>

          <div className="p-2">
            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <i className={`ri-${isDarkMode ? 'sun' : 'moon'}-line text-xl`}></i>
              <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 mt-1"
            >
              <i className="ri-logout-box-r-line text-xl"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem('token');
        navigate('/captains/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center space-x-2 px-2 py-1 text-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
    >
      <i className="ri-logout-box-line pe-4"></i>  Logout
    </button>
  );
};

export default CaptainLogout;

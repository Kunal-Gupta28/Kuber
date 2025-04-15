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
      className="me-3 bg-white h-12 w-12 p-2 text-2xl rounded-full flex justify-center items-center cursor-pointer"
    >
      <i className="ri-logout-box-r-line"></i>
    </button>
  );
};

export default CaptainLogout;

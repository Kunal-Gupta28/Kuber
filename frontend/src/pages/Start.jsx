import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bgImage from '/images/Kuber.jpeg';
import DarkModeToggle from '../components/DarkModeToggle';

const Start = () => {
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`w-full h-[100dvh] flex flex-col transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Dark Mode Toggle */}
      <DarkModeToggle />

      {/* Background Image Section */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
        <div
          className="h-full w-full bg-cover bg-center md:bg-center-bottom bg-no-repeat z-10 relative flex flex-col justify-end p-6"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="text-white">
            <i className="ri-taxi-line text-4xl md:text-6xl mb-2"></i>
            <h1 className="text-3xl md:text-5xl font-bold">Kuber</h1>
            <p className="text-base md:text-lg mt-2">Your ride, your way. Reliable. Fast. Local.</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={`h-auto px-6 flex flex-col justify-center transition-colors duration-500 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <p className="text-2xl font-bold text-center my-6">Get started with Kuber</p>
        <Link
          to="/users/login"
          className={`font-semibold py-3 px-6 rounded-xl shadow-md hover:opacity-90 transition duration-300 text-center text-lg w-[90%] max-w-md mx-auto ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
        >
          Continue
        </Link>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 my-6">
          © 2025 Kuber Technologies. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Start;

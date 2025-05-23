import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200/20 dark:border-gray-700/20"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <i className="ri-sun-line text-xl text-yellow-400"></i>
      ) : (
        <i className="ri-moon-line text-xl text-gray-700 dark:text-gray-300"></i>
      )}
    </button>
  );
};

export default DarkModeToggle; 
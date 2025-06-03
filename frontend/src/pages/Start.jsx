import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bgImageMobile from '/images/kubik-mobile.webp';
import bgImageDesktop from '/images/kubik.webp';
import DarkModeToggle from '../components/DarkModeToggle';

const Start = () => {
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

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
    <section
      className={`w-full h-[100dvh] flex flex-col transition-colors duration-500 ${
        darkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-5 right-5 z-50">
        <DarkModeToggle />
      </div>

      {/* Background Image Section */}
      <div className="flex-1 relative">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

        {/* Mobile background */}
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat z-10 relative flex flex-col justify-end p-[clamp(1rem,3vw,2rem)] md:hidden"
          style={{ backgroundImage: `url(${bgImageMobile})` }}
        >
          <div className="text-white">
            <i className=" ri-taxi-line text-[clamp(1.5rem,10vh,4rem)]"></i>
            <h1 className="text-xs text-[clamp(1.5rem,5vh,3rem)] font-bold">Kubik</h1>
            <p className="text-xs text-[clamp(0.3rem,2.5vh,1rem)] mt-2">Your ride, your way. Reliable. Fast. Local.</p>
          </div>
        </div>

        {/* Desktop background */}
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat z-10 relative hidden md:flex flex-col justify-end px-[clamp(1.5rem,3vw,2.5rem)] py-[clamp(1rem,2vw,2rem)]"
          style={{ backgroundImage: `url(${bgImageDesktop})` }}
        >
          <div className="text-white">
            <i className="ri-taxi-line text-xxl text-[clamp(5rem,5vw,9rem)]"></i>
            <h1 className="text-xl text-[clamp(5rem,5vw,9rem)]  mb-[clamp(0.5rem,1.7vw,3.5rem)] font-bold">Kubik</h1>
            <p className="text-xl text-[clamp(1rem,1vw,1.6rem)]">Your ride, your way. Reliable. Fast. Local.</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        className={`h-auto px-[clamp(1rem,3vw,2rem)] flex flex-col justify-center transition-colors duration-500 ${
          darkMode ? 'bg-black' : 'bg-white'
        }`}
      >
        <p className="text-[clamp(1.25rem,2vw,2rem)] font-bold text-center my-[clamp(1rem,2vw,2rem)]">Get started with Kubik</p>
        <Link
          to="/users/login"
          className={`font-semibold py-[clamp(0.75rem,1.5vw,1rem)] px-[clamp(1.5rem,2vw,2rem)] rounded-xl shadow-md hover:opacity-90 transition duration-300 text-center text-[clamp(1rem,1.25vw,1.5rem)] w-[90%] max-w-md mx-auto ${
            darkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
        >
          Continue
        </Link>
        <p className="text-center text-[clamp(0.75rem,1vw,1rem)] text-gray-400 dark:text-gray-500 my-[clamp(1rem,2vw,2rem)]">
          © 2025 Kubik Technologies. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Start;

import bgImage from '/images/Kuber.jpeg';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <section className="w-full h-screen flex flex-col">
      {/* Top Image Section */}
      <div
        className="flex-1 p-4 bg-cover bg-center bg-no-repeat flex items-start"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold bg-black bg-opacity-40 px-4 py-2 rounded-lg">
          Kuber
        </h1>
      </div>

      {/* Bottom Section */}
      <div className="p-5 flex flex-col justify-between h-[30%] sm:h-[25%] md:h-[20%] lg:h-[14%]">
        <p className="mb-4 text-xl sm:text-2xl md:text-3xl font-bold text-center">
          Get started with Kuber
        </p>
        <Link
          to="/users/login"
          className="bg-black text-white font-semibold py-3 rounded-md text-center text-base sm:text-lg md:text-xl w-[90%] max-w-md mx-auto"
        >
          Continue
        </Link>
      </div>
    </section>
  );
};

export default Start;

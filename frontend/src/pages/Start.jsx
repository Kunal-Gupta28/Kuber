import bgImage from '/images/Kuber.jpeg';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <section className="w-full h-screen">
      <div className="h-[80%] lg:h-[86%] p-3 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
        <h1 className="font-bold text-xl">Kuber</h1>
      </div>
      {/* <img src={image} alt="" /> */}
      <div className="h-[20%] lg:h-[14%] p-5 flex flex-col">
        <p className="mb-7 font-bold text-2xl">Get started with Kuber</p>
        <Link to='/users/login' className="bg-black w-[96%] py-3 text-white font-bold mx-auto flex justify-center">
          Continue
        </Link>
      </div>
    </section>
  );
};

export default Start;

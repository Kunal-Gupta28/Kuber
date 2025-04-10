import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "./LiveTracking";

const Riding = () => {
  const location = useLocation();
  const state = location.state || {};
  const {
    pickupMain,
    pickupDetails,
    destinationMain,
    destinationDetails,
    ride
  } = state;
  const coordinates =
    state.coordinates || JSON.parse(localStorage.getItem("coordinates"));
  

  const fare = ride?.fare;
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  // Listen for ride-ended only once
  useEffect(() => {
    const handleRideEnded = (ride) => {
      const {captain,user} = ride
      navigate("/home");
    };

    socket?.on("ride-ended", handleRideEnded);
    return () => socket?.off("ride-ended", handleRideEnded);
  }, [socket, navigate]);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Home Icon */}
      <Link to="/home">
        <span className="fixed top-2 right-5 z-50 text-3xl p-3 bg-white rounded-full shadow-md">
          <i className="ri-home-4-line"></i>
        </span>
      </Link>

      {/* Live Tracking - 70% */}
      <div className="w-full md:w-[70%] h-[50vh] md:h-full">
        <LiveTracking coordinates={coordinates}/>
      </div>

      {/* Ride Details - 30% */}
      <div className="w-full md:w-[30%] h-[50vh] md:h-full overflow-y-auto bg-white px-4 py-6 space-y-4 shadow-inner">
        {/* Vehicle image */}
        <div className="flex justify-center relative">
          <div className="h-20 w-64 bg-[#eff3fe] rounded-full flex justify-center">
            <div className="h-16 w-44 bg-[#d4e2fc] rounded-full flex justify-center">
              <img
                className="w-40 absolute top-[-8%]"
                src="/vehicle-placeholder.png"
                alt="Vehicle"
              />
            </div>
          </div>
        </div>

        {/* Pickup Info */}
        <div className="flex border-t pt-4">
          <span className="w-10 flex justify-center items-start pt-1">
            <i className="ri-map-pin-line text-green-600"></i>
          </span>
          <div>
            <h3 className="font-semibold text-lg">{pickupMain}</h3>
            <p className="text-gray-500 text-sm">{pickupDetails}</p>
          </div>
        </div>

        {/* Destination Info */}
        <div className="flex border-t pt-4">
          <span className="w-10 flex justify-center items-start pt-1">
            <i className="ri-square-fill text-red-500"></i>
          </span>
          <div>
            <h3 className="font-semibold text-lg">{destinationMain}</h3>
            <p className="text-gray-500 text-sm">{destinationDetails}</p>
          </div>
        </div>

        {/* Fare Info */}
        <div className="flex border-t pt-4">
          <span className="w-10 flex justify-center items-start pt-1">
            <i className="ri-bank-card-2-fill text-blue-600"></i>
          </span>
          <div className="w-full">
            <h3 className="font-semibold text-lg">₹{fare}</h3>
            <p className="text-gray-500 text-sm">Cash</p>
          </div>
        </div>

        {/* Payment Button */}
        <button className="w-full mt-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-lg">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;

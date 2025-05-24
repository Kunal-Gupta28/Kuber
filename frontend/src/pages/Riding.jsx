import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../context/socketContext";
import { useRideContext } from "../context/RideContext";
import LiveTracking from "../components/LiveTracking";
import RideDetails from "../components/RideDetails";
import Payment from "../components/Payment";
import gsap from "gsap";

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const {setPickup , setDestination} = useRideContext()
  const [showHomeButton,setShowHomeButton] = useState(false)

  const state = location.state || {};
  const ride = state.ride || null;
  const coordinates =
    state.coordinates || JSON.parse(localStorage.getItem("coordinates"));

  const rideDetailsRef = useRef(null);


  // listing for ride end 
  useEffect(() => {
    const handleRideEnded = (ride) => {
      if (ride?.captain && ride?.user) {
        setDestination('')
        setPickup('')
        navigate("/home");
      }
    };

    socket?.on("ride-ended", handleRideEnded);
    return () => socket?.off("ride-ended", handleRideEnded);
  }, [socket, navigate]);

  //  animation for show ride details
  const showRideDetails = () => {
    gsap.to(rideDetailsRef.current, {
      y: 0,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  // aniamiton for hide ride details
  const hideRideDetails = () => {
    gsap.to(rideDetailsRef.current, {
      y: "100%",
      duration: 0.5,
      ease: "power3.in",
    });
  };

  return (
    <main className="h-[100dvh] w-full flex flex-col overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 rounded-xl p-2 px-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          Kuber
        </h1>
      </div>

      {/* Map Section */}
      <section className="  h-[85%] xl:h-[85%] 4k:h-[90%]">
        <LiveTracking coordinates={coordinates}/>
      </section>

      {/* Control Panel */}
      <div className="h-[20%] xl:h-[17%] 4k:h-[11%] w-full bg-gradient-to-b from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 p-4 sm:p-5 fixed bottom-0 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 z-40 shadow-inner rounded-t-3xl border-t border-yellow-300 dark:border-yellow-600">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4 4k:gap-48 sm:gap-6">
        <div className="h-14 sm:h-16 w-full sm:w-48">
            {showHomeButton ? (
              <button
                onClick={() => {
                  navigate('/home');
                  setPickup('');
                  setDestination('');
                }}
                className="w-full h-full bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl text-lg sm:text-xl font-semibold text-white flex justify-center items-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Home
              </button>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl text-lg sm:text-xl font-semibold text-white flex justify-center items-center shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  4 Km away
                </span>
              </div>
            )}
          </div>
          <button
            onClick={showRideDetails}
            className="h-14 sm:h-16 w-full sm:w-48 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl text-lg sm:text-xl font-semibold text-white shadow-lg hover:bg-green-700 dark:hover:bg-green-800 transition-all duration-300 hover:shadow-xl active:scale-95"
          >
            Make Payment
          </button>
        </div>
      </div>

      {/* Ride Details Panel */}
      <section
        ref={rideDetailsRef}
        className="w-full fixed bottom-0 translate-y-full bg-white dark:bg-gray-800 z-50 shadow-xl rounded-t-3xl transition-transform duration-500"
        style={{ transform: "translateY(100%)" }}
      >
        <div className="p-6 sm:p-8">
          <RideDetails ride={ride} />

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <Payment hideRideDetails={hideRideDetails} setShowHomeButton={setShowHomeButton} />
            <button
              onClick={hideRideDetails}
              className="w-48 p-3 rounded-xl font-bold text-lg transition-colors bg-black dark:bg-gray-900 hover:bg-gray-800 dark:hover:bg-gray-700 text-white"
            >
              Back
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Riding;

import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import LiveTracking from "../components/LiveTracking";
import axios from "axios";
import gsap from "gsap";
import {SocketContext} from '../context/socketContext'
import {toast} from "react-hot-toast";

const CaptainRiding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {socket} = useContext(SocketContext);

  const state = location.state || {};
  const ride = state.ride || null;
  const coordinates =
    state.coordinates || JSON.parse(localStorage.getItem("coordinates"));

  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRideRef = useRef(null);

// listning for payment successful
  useEffect(() => {
    const handlePaymentSuccess = (data) => {
      toast.success(data.message);
    };
  
    socket.on("PAYMENT_SUCCESS", handlePaymentSuccess);
  
    return () => {
      socket.off("PAYMENT_SUCCESS", handlePaymentSuccess);
    };
  }, []);

  // Animate panel on open
  useEffect(() => {
    if (finishRidePanel && finishRideRef.current) {
      gsap.to(finishRideRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [finishRidePanel]);

  // Trigger show panel
  const showFinishRide = () => setFinishRidePanel(true);

  // Trigger hide panel
  const hideFinishRide = () => {
    if (!finishRideRef.current) return;
    gsap.to(finishRideRef.current, {
      y: "100%",
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => setFinishRidePanel(false),
    });
  };

  // Send finish ride request
  const handleFinishRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        {
          rideId: ride?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/captains/home");
      }
    } catch (error) {
      console.error("Error finishing ride:", error);
    }
  };



  return (
    <main className="h-[100dvh] w-full flex flex-col overflow-hidden dark:bg-gray-900 text-black dark:text-white relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 rounded-xl p-2 px-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          Kuber
        </h1>
      </header>

      {/* Map Section */}
      <section className="h-[75vh] sm:h-[80vh] mt-16">
        <LiveTracking coordinates={coordinates} />
      </section>

      {/* Control Panel */}
      <footer className="h-[25vh] sm:h-[20vh] w-full bg-gradient-to-b from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 p-4 sm:p-5 fixed bottom-0 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 z-40 shadow-inner rounded-t-3xl border-t border-yellow-300 dark:border-yellow-600">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="h-14 sm:h-16 w-full sm:w-48 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl text-lg sm:text-xl font-semibold text-white flex justify-center items-center shadow-lg hover:shadow-xl transition-all duration-300">
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
          <button
            onClick={showFinishRide}
            className="h-14 sm:h-16 w-full sm:w-48 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl text-lg sm:text-xl font-semibold text-white shadow-lg hover:bg-green-700 dark:hover:bg-green-800 transition-all duration-300 hover:shadow-xl active:scale-95"
          >
            Finish Ride
          </button>
        </div>
      </footer>

      {/* Finish Ride Panel */}
      {finishRidePanel && (
        <section
          ref={finishRideRef}
          className="w-full fixed bottom-0 translate-y-full bg-white dark:bg-gray-800 z-50 shadow-xl rounded-t-3xl transition-transform duration-500"
          style={{ transform: "translateY(100%)" }}
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Confirm End of Ride
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-base sm:text-lg">
              Are you sure you want to finish this ride?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleFinishRide}
                className="h-14 sm:h-16 w-full sm:w-48 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl active:scale-95"
              >
                Confirm
              </button>
              <button
                onClick={hideFinishRide}
                className="h-14 sm:h-16 w-full sm:w-48 bg-gradient-to-r from-gray-900 to-black dark:from-gray-800 dark:to-gray-900 hover:from-gray-800 hover:to-gray-900 dark:hover:from-gray-700 dark:hover:to-gray-800 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default CaptainRiding;

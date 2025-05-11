import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useRideContext } from "../context/RideContext";

const LookingForDriver = ({ setVehicleFound, setConfirmRidePanel }) => {
  const { confirmRideDetails } = useRideContext();
  const containerRef = useRef(null);
  const dotsRef = useRef(null);

  // Animate container entrance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.from(containerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Animate loading dots
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const dots = dotsRef.current?.children;
      if (dots && dots.length > 0) {
        gsap.to(dots, {
          y: -8,
          scale: 1.3,
          opacity: 0.6,
          duration: 0.6,
          stagger: 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, dotsRef);
    return () => ctx.revert();
  }, []);

  if (!confirmRideDetails) {
    return (
      <div className="h-[50vh] w-full bg-white dark:bg-gray-900 text-black dark:text-white flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading ride details...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="h-full flex flex-col items-center justify-center p-8">
        {/* Vehicle Image */}
        <div className="relative w-40 h-40 mb-8">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full animate-pulse"></div>
          <img
            src={confirmRideDetails.image || "/fallback.png"}
            alt={confirmRideDetails.vehicleType || "Vehicle"}
            className="relative w-full h-full object-contain"
          />
        </div>

        {/* Loading Text */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Looking for a driver</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we find the best match for you</p>
        </div>

        {/* Animated Loading Dots */}
        <div ref={dotsRef} className="flex gap-2 mb-8">
          <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
        </div>

        {/* Ride Details */}
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0">
                <img
                  src={confirmRideDetails.image || "/fallback.png"}
                  alt={confirmRideDetails.vehicleType || "Vehicle"}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold">{confirmRideDetails.vehicleType}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {confirmRideDetails.capacity} seats
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600 dark:text-blue-400">₹{confirmRideDetails.fare || "--"}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <i className="ri-time-line text-blue-500 dark:text-blue-400"></i>
            <span className="text-gray-600 dark:text-gray-300">Estimated arrival time: 2–5 minutes</span>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => {
            setVehicleFound(false);
            setConfirmRidePanel(true);
          }}
          className="mt-8 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                   text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 
                   transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Cancel Ride
        </button>
      </div>
    </div>
  );
};

export default LookingForDriver;

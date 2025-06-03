import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useRideContext } from "../context/RideContext";

const LookingForDriver = ({ setVehicleFound, setConfirmRidePanel }) => {
  const { vehicleInfo } = useRideContext();
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
      if (!dots || !Array.isArray(dots)) return;

      const tl = gsap.timeline({ repeat: -1 });

      Array.from(dots).forEach((dot, index) => {
        gsap.set(dot, {
          y: 0,
          scale: 1,
          opacity: 0.6,
        });

        tl.to(dot, {
          y: -12,
          scale: 1.3,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(1.2)",
        }, index * 0.2)
          .to(dot, {
            duration: 0.1,
            ease: "none",
          })
          .to(dot, {
            y: 0,
            scale: 1,
            opacity: 0.6,
            duration: 0.4,
            ease: "power2.in",
          }, ">-0.1");
      });
    }, dotsRef);
    return () => ctx.revert();
  }, []);

  if (!vehicleInfo) {
    return (
      <div className="h-[50vh] w-full bg-white dark:bg-gray-900 text-black dark:text-white flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)" }}>
          Loading ride details...
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="h-full flex flex-col items-center justify-center p-2 xl:p-8">
        {/* Vehicle Image */}
        <div className="relative w-32 h-32 xl:w-40 xl:h-40 mb-4 xl:mb-8">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full animate-pulse"></div>
          <img
            src={vehicleInfo.image || "/fallback.png"}
            alt={vehicleInfo.vehicleType || "Vehicle"}
            className="relative w-full h-full object-contain"
          />
        </div>

        {/* Loading Text */}
        <div className="text-center mb-4 xl:mb-6">
          <h2
            className="font-bold mb-2 text-gray-800 dark:text-white"
            style={{ fontSize: "clamp(1.25rem, 5vw, 2rem)" }}
          >
            Looking for a driver
          </h2>
          <p
            className="text-gray-600 dark:text-gray-400"
            style={{ fontSize: "clamp(0.9rem, 3vw, 1.125rem)" }}
          >
            Please wait while we find the best match for you
          </p>
        </div>

        {/* Animated Loading Dots */}
        <div ref={dotsRef} className="flex gap-4 mb-6 xl:mb-8">
          <div className="rounded-full transform-gpu shadow-lg bg-blue-500 dark:bg-blue-400"
               style={{ width: "clamp(0.5rem, 1.5vw, 0.75rem)", height: "clamp(0.5rem, 1.5vw, 0.75rem)" }} />
          <div className="rounded-full transform-gpu shadow-lg bg-blue-500 dark:bg-blue-400"
               style={{ width: "clamp(0.5rem, 1.5vw, 0.75rem)", height: "clamp(0.5rem, 1.5vw, 0.75rem)" }} />
          <div className="rounded-full transform-gpu shadow-lg bg-blue-500 dark:bg-blue-400"
               style={{ width: "clamp(0.5rem, 1.5vw, 0.75rem)", height: "clamp(0.5rem, 1.5vw, 0.75rem)" }} />
        </div>

        {/* Ride Details */}
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0">
                <img
                  src={vehicleInfo.image || "/fallback.png"}
                  alt={vehicleInfo.vehicleType || "Vehicle"}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold" style={{ fontSize: "clamp(1rem, 4vw, 1.125rem)" }}>
                  {vehicleInfo.vehicleType}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400" style={{ fontSize: "clamp(0.8rem, 3vw, 0.95rem)" }}>
                  {vehicleInfo.capacity} seats
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600 dark:text-blue-400" style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}>
                ₹{vehicleInfo.fare || "--"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <i className="ri-time-line text-blue-500 dark:text-blue-400" style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}></i>
            <span className="text-gray-600 dark:text-gray-300" style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)" }}>
              Estimated arrival time: 2–5 minutes
            </span>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => {
            setVehicleFound(false);
            setConfirmRidePanel(true);
          }}
          className="my-6 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                   text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 
                   transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ fontSize: "clamp(0.95rem, 3vw, 1.1rem)" }}
        >
          Cancel Ride
        </button>
      </div>
    </div>
  );
};

export default LookingForDriver;

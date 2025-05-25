import React from "react";
import { useRideContext } from "../context/RideContext";

const WaitingForDriver = () => {
  const {
    ride,
    pickupMain,
    pickupDetails,
    vehicleInfo,
  } = useRideContext();

  if (!vehicleInfo || !ride) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 text-black dark:text-white flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading ride details...</p>
      </div>
    );
  }

  const driverName = [
    ride?.captain?.fullname?.firstname,
    ride?.captain?.fullname?.lastname,
  ]
    .filter(Boolean)
    .join(" ") || "Your Driver";

  const vehiclePlate = ride?.captain?.vehicle?.plate || "Plate Number";
  const vehicleModel =
    `${ride?.captain?.vehicle?.color || ""} ${ride?.captain?.vehicle?.model || ""}`.trim() ||
    "Vehicle Info";

  const otp = ride?.otp || "----";

  return (
    <div className="h-full w-full bg-white dark:bg-gray-900 text-black dark:text-white overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b-2 border-gray-200 dark:border-gray-700">
          <span className="text-sm sm:text-base font-medium text-gray-800 dark:text-white">
            Meet at the pickup point
          </span>
          <span className="bg-black dark:bg-gray-800 text-white text-center px-3 py-1 rounded-lg font-medium text-sm sm:text-base">
            <span>2</span>
            <br />
            min
          </span>
        </div>

        {/* Driver and Vehicle Info */}
        <div className=" flex-1 p-6 sm:p-6">
          <div className="flex flex-row gap-4 sm:gap-6 py-3">
            {/* Driver and Vehicle Images */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-20 w-20 4k:h-32 4k:w-32 z-10 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
              {ride?.captain?.image ? (
                  <img
                    src={ride.captain.image}
                    alt="Captain"
                    className="w-full h-full rounded-full object-cover"
                  />
                  ) : (
                    <i className="ri-user-line text-2xl sm:text-3xl text-white" />
                  )}
              </div>
              <div className="h-20 w-20 4k:h-32 4k:w-32 -ms-8 xl:-ms-12 rounded-full overflow-hidden flex justify-center items-center bg-gray-200 dark:bg-gray-600">
                {vehicleInfo.image ? (
                  <img
                    src={vehicleInfo.image}
                    className="h-20 w-20 4k:h-32 4k:w-32 object-contain"
                    alt="Vehicle"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-vehicle.png";
                    }}
                  />
                ) : (
                  <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
                )}
              </div>
            </div>

            {/* Driver Info */}
            <div className="flex-1 text-right">
              <h2 className="text-sm sm:text-base text-gray-400 dark:text-gray-300">{driverName}</h2>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">{vehiclePlate}</h1>
              <h2 className="text-sm sm:text-base text-gray-400 dark:text-gray-300">{vehicleModel}</h2>
              <h3 className="text-yellow-500 dark:text-yellow-400 font-semibold text-sm sm:text-base">⭐ 4.3</h3>
            </div>
          </div>

          {/* OTP */}
          <div className="w-full xl:w-1/3 xl:mx-auto p-4 text-center text-xl sm:text-2xl my-3 sm:my-4 py-4 sm:py-5 
                   border border-gray-200 dark:border-gray-700 rounded-xl font-bold animate-pulse
                   bg-gray-50 dark:bg-gray-800">
            OTP : {otp}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-around p-4 sm:p-6">
            <div className="flex flex-col items-center gap-2">
              <span className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-400 dark:bg-gray-600 rounded-full 
                            flex items-center justify-center transition-transform hover:scale-110">
                <i className="ri-shield-line text-white text-lg sm:text-xl"></i>
              </span>
              <h5 className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Safety</h5>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-400 dark:bg-gray-600 rounded-full 
                            flex items-center justify-center transition-transform hover:scale-110">
                <i className="ri-share-line text-white text-lg sm:text-xl"></i>
              </span>
              <h5 className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Share Trip</h5>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-400 dark:bg-gray-600 rounded-full 
                            flex items-center justify-center transition-transform hover:scale-110">
                <i className="ri-phone-line text-white text-lg sm:text-xl"></i>
              </span>
              <h5 className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Call Captain</h5>
            </div>
          </div>
        </div>

        {/* Pick-up Address */}
        <div className="flex border-t-2 border-gray-300 dark:border-gray-700 py-3 px-4 sm:px-6  pb-5 items-center">
          <span className="w-10 sm:w-12 flex justify-center items-center">
            <i className="ri-map-pin-line text-lg sm:text-xl text-gray-600 dark:text-gray-300"></i>
          </span>
          <div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-white pb-1">
              {pickupMain}
            </h3>
            <h5 className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {pickupDetails}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;

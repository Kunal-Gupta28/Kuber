import { useEffect } from "react";
import { useRideContext } from "../context/RideContext";

const RideDetails = ({ userType }) => {
  const {
    pickup,
    destination,
    vehicleInfo,
    distance,
    duration,
    fare,
    setIsUserTypeIsCaptain,
  } = useRideContext();

  useEffect(() => {
    if (userType === "captain") {
      setIsUserTypeIsCaptain(true);
    }
  }, [userType, setIsUserTypeIsCaptain]);

  const isDataMissing =
    userType === "captain"
      ? !pickup || !destination
      : !vehicleInfo || !pickup || !destination;

  if (isDataMissing) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-[clamp(0.875rem,2.5vw,1rem)]">
        <p>Loading ride details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 xl:space-y-7">
      {/* Vehicle Details (Hide for captain) */}
      {userType !== "captain" && (
        <div className="flex items-center gap-4 p-2 xl:p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={vehicleInfo.image || "/fallback.png"}
              alt={vehicleInfo.vehicleType || "Vehicle"}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-[clamp(1rem,2.5vw,1.25rem)] font-semibold">
                {vehicleInfo.vehicleType}
              </h3>
              <div className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full text-[clamp(0.75rem,2vw,0.875rem)]">
                <i className="ri-user-fill mr-1"></i>
                {vehicleInfo.capacity}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-[clamp(0.75rem,2vw,0.875rem)]">
              {vehicleInfo.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-blue-600 dark:text-blue-400">
              ₹{fare || "--"}
            </p>
            <p className="text-[clamp(0.75rem,2vw,0.875rem)] text-gray-500 dark:text-gray-400">
              Estimated fare
            </p>
          </div>
        </div>
      )}

      {/* Trip Details */}
      <div className="space-y-3 xl:space-y-6">
        {/* Pickup */}
        <div className="flex items-start gap-4 p-2 xl:p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full">
            <i className="ri-map-pin-fill text-green-600 dark:text-green-400"></i>
          </div>
          <div className="flex-grow">
            <p className="text-[clamp(0.75rem,2vw,0.875rem)] text-gray-500 dark:text-gray-400 mb-1">
              Pickup
            </p>
            <p className="font-medium text-[clamp(0.875rem,2.5vw,1rem)]">{pickup}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-4 p-2 xl:p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full">
            <i className="ri-flag-fill text-red-600 dark:text-red-400"></i>
          </div>
          <div className="flex-grow">
            <p className="text-[clamp(0.75rem,2vw,0.875rem)] text-gray-500 dark:text-gray-400 mb-1">
              Destination
            </p>
            <p className="font-medium text-[clamp(0.875rem,2.5vw,1rem)]">{destination}</p>
          </div>
        </div>
      </div>

      {/* Distance & Duration */}
      <div className="px-4 xl:py-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-[clamp(0.8rem,2.5vw,1rem)]">
        <div className="flex justify-between items-center mb-0 xl:mb-2">
          <span className="text-gray-600 dark:text-gray-300">Distance</span>
          <span className="font-medium">
            {distance ? `~${distance}` : "Calculating..."}
          </span>
        </div>
        <div className="flex justify-between items-center mb-0 xl:mb-2">
          <span className="text-gray-600 dark:text-gray-300">Duration</span>
          <span className="font-medium">
            {duration ? `~${duration} mins` : "Calculating..."}
          </span>
        </div>
        {userType !== "captain" && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Vehicle Type</span>
            <span className="font-medium">{vehicleInfo.vehicleType}</span>
          </div>
        )}
      </div>

      {/* Safety Info */}
      {userType !== "captain" && (
        <div className="flex justify-center items-center gap-3 p-3 xl:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[clamp(0.7rem,2vw,0.875rem)]">
          <i className="ri-shield-check-line text-blue-600 dark:text-blue-400 text-xl"></i>
          <p className="text-gray-600 dark:text-gray-300">
            Your ride is covered by our safety measures and insurance
          </p>
        </div>
      )}
    </div>
  );
};

export default RideDetails;

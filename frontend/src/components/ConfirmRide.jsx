import axios from "axios";
import RideDetails from "./RideDetails";
import { useRideContext } from "../context/RideContext";

const ConfirmRide = ({ setVehicleFound, setConfirmRidePanel, setPanelOpen }) => {
  const {
    pickup,
    destination,
    setPickup,
    setDestination,
    fare,
    distance,
    duration,
  } = useRideContext();

  const handleRideConfirmation = async () => {
    setConfirmRidePanel(false);
    setVehicleFound(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickupPoint: pickup,
          destination,
          fare,
          distance,
          duration,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error creating ride:", error);
    }
  };

  return (
    <div className="w-full  bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-2xl mx-auto px-4 xl:py-6 py-4 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-4 xl:mb-6">
          <h2 className="text-[clamp(1.25rem,4vw,2rem)] font-bold mb-1 xl:mb-2">
            Confirm Your Ride
          </h2>
          <p className="text-[clamp(0.875rem,2.5vw,1rem)] text-gray-600 dark:text-gray-400">
            Review your trip details before confirming
          </p>
        </div>

        {/* Ride Details */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
          <RideDetails userType="user" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 sm:gap-8 justify-center items-center">
          <button
            onClick={handleRideConfirmation}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
              text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] 
              active:scale-[0.98] shadow-md hover:shadow-lg text-[clamp(0.875rem,2.5vw,1rem)]"
          >
            Confirm Ride
          </button>

          <button
            onClick={() => {
              setConfirmRidePanel(false);
              setPanelOpen(true);
              setPickup("");
              setDestination("");
            }}
            className="w-full sm:w-auto px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
              text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-all duration-300 
              transform hover:scale-[1.02] active:scale-[0.98] text-[clamp(0.875rem,2.5vw,1rem)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRide;

import React from "react";
import axios from "axios";
import RideDetails from "./RideDetails";
import { useRideContext } from "../context/RideContext";

const ConfirmRide = ({
  setVehicleFound,
  setConfirmRidePanel,
  setPanelOpen,
}) => {
  const { pickup, destination, setPickup, setDestination, confirmRideDetails } =
    useRideContext();

  const handleRideConfirmation = async () => {
    setConfirmRidePanel(false);
    setVehicleFound(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickupPoint: pickup,
          destination,
          vehicleType: confirmRideDetails.vehicleType,
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
    <div className="w-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Confirm Your Ride</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Review your trip details before confirming
          </p>
        </div>

        {/* Ride Details */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
          <RideDetails
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
            setPanelOpen={setPanelOpen}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRideConfirmation}
            className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                     text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] 
                     active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            <i className="ri-check-line mr-2"></i>
            Confirm Ride
          </button>
          <button
            onClick={() => {
              setConfirmRidePanel(false);
              setPanelOpen(true);
              setPickup("");
              setDestination("");
            }}
            className="flex-1 sm:flex-none px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
                     text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-all duration-300 
                     transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <i className="ri-close-line mr-2"></i>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmRide;

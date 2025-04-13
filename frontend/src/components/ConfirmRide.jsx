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
    <div className="w-screen">
      <h2 className="text-center text-2xl font-semibold mb-5 pt-5 border-b-2">
        Looking for nearby drivers
      </h2>

      <RideDetails
        setConfirmRidePanel={setConfirmRidePanel}
        setVehicleFound={setVehicleFound}
        setPanelOpen={setPanelOpen}
      />

      {/* Continue / Cancel Buttons */}
      <div className="flex justify-evenly">
        <button
          onClick={handleRideConfirmation}
          className="w-48 block my-5 py-2 bg-black hover:bg-gray-900 rounded-xl text-white font-bold text-xl transition duration-200"
        >
          Continue
        </button>
        <button
          onClick={() => {
            setConfirmRidePanel(false);
            setPanelOpen(true);
            setPickup("");
            setDestination("");
          }}
          className="w-48 block my-5 py-2 bg-black hover:bg-gray-900 rounded-xl text-white font-bold text-xl transition duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;

import React from "react";
import { useRideContext } from "../context/RideContext";
import RideDetails from "./RideDetails";

const LookingForDriver = ({ setVehicleFound, setPanelOpen }) => {
  const { setPickup, setDestination } = useRideContext;
  return (
    <div className="w-screen relative">
      <h2 className="text-center text-2xl font-semibold mb-5 pt-5 border-b-2">
        Wait we are Looking driver for ride
      </h2>

      <RideDetails />

      {/* Cancel Button */}
      <button
        onClick={() => {
          setVehicleFound(false);
          setPanelOpen(true);
          setPickup("");
          setDestination("");
        }}
        className="w-48 absolute bottom-0 right-[5%] py-2 bg-black hover:bg-gray-900 rounded-xl text-white font-bold text-xl transition duration-200"
      >
        Cancel
      </button>
    </div>
  );
};

export default LookingForDriver;

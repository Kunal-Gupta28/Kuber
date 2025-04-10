import React from "react";
import axios from "axios";

const ConfirmRide = ({
  pickup,
  destination,
  pickupMain,
  pickupDetails,
  destinationMain,
  destinationDetails,
  confirmRideDetails,
  setVehicleFound,
  setConfirmRidePanel,
  setPanelOpen,
  setPickup,
  setDestination,
}) => {
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

      {/* Vehicle image */}
      <div className="my-2 py-5 flex justify-center relative">
        <span className="h-20 w-64 bg-[#eff3fe] rounded-full flex justify-center">
          <span className="h-16 bg-[#d4e2fc] rounded-full w-44 flex justify-center">
            <img
              className="w-40 absolute top-[-8%]"
              src={confirmRideDetails?.image || "/fallback.png"}
              alt={confirmRideDetails?.vehicleType || "Vehicle"}
            />
          </span>
        </span>
      </div>

      {/* Pickup Address */}
      <div className="flex border-t-2 border-gray-200 py-3">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-map-pin-line"></i>
        </span>
        <div>
          <h3 className="font-semibold text-xl pb-1">{pickupMain}</h3>
          <h5 className="text-gray-500 text-md">{pickupDetails}</h5>
        </div>
      </div>

      {/* Destination */}
      <div className="flex border-t-2 border-gray-200 py-3">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-square-fill"></i>
        </span>
        <div>
          <h3 className="font-semibold text-xl pb-1">{destinationMain}</h3>
          <h5 className="text-gray-500 text-md">{destinationDetails}</h5>
        </div>
      </div>

      {/* Bill Info */}
      <div className="flex border-t-2 border-gray-200 py-3">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-bank-card-2-fill"></i>
        </span>
        <div className="w-full">
          <h3 className="font-semibold text-xl pb-1">
            ₹{confirmRideDetails.fare}
          </h3>
          <h3 className="text-gray-500 text-md">Cash</h3>
        </div>
      </div>

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
            setPickup('');
            setDestination('');
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

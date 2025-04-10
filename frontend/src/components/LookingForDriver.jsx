import React from "react";

const LookingForDriver = ({
  pickupMain,
  pickupDetails,
  destinationMain,
  destinationDetails,
  confirmRideDetails,
  setVehicleFound,
  setPanelOpen,
  setPickup,
  setDestination
}) => {
  return (
    <div className="w-screen relative">
      <h2 className="text-center text-2xl font-semibold mb-5 pt-5 border-b-2">
        Wait we are Looking driver for ride
      </h2>

      {/* Vehicle Image */}
      <div className="my-2 py-5 flex justify-center relative">
        <span className="h-20 w-64 bg-[#eff3fe] rounded-full flex justify-center">
          <span className="h-16 bg-[#d4e2fc] rounded-full w-44 flex justify-center">
            <img
              className="w-40 absolute top-[-8%]"
              src={confirmRideDetails.image || "/images/placeholder.png"}
              alt={confirmRideDetails.vehicleType || "vehicle"}
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

      {/* Destination Address */}
      <div className="flex border-t-2 border-gray-200 py-3">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-square-fill"></i>
        </span>
        <div>
          <h3 className="font-semibold text-xl pb-1">{destinationMain}</h3>
          <h5 className="text-gray-500 text-md">{destinationDetails}</h5>
        </div>
      </div>

      {/* Fare Info */}
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

      {/* Cancel Button */}
      <button
          onClick={() => {
            setVehicleFound(false);
            setPanelOpen(true);
            setPickup('');
            setDestination('');
          }}
          className="w-48 absolute bottom-0 right-[5%] py-2 bg-black hover:bg-gray-900 rounded-xl text-white font-bold text-xl transition duration-200"
        >
          Cancel
        </button>
    </div>
  );
};

export default LookingForDriver;

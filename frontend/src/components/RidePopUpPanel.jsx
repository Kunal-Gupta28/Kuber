import React, { useState } from "react";

const RidePopUpPanel = ({
  ride,
  pickupMain,
  pickupDetails,
  destinationMain,
  destinationDetails,
  setRidePopUpPanel,
  setConfirmRidePopUpPanel,
  confirmRide,
}) => {
  if (!ride) return null;

  return (
    <div className=" w-screen bg-white p-5 rounded-lg shadow-lg">
      <h2 className="text-center text-2xl font-semibold pt-2">
        New ride available
      </h2>

      {/* Ride Details */}
      <div className="my-4">
        <div className="flex justify-between items-center px-5 py-3 rounded-xl bg-gray-200">
          <div className="h-20 w-20 rounded-full bg-red-200 overflow-hidden">
            <img
              src={ride?.user?.profilePicture || "/default-avatar.png"}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="text-2xl font-bold -ms-10">
            {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
          </h3>

          <h3 className="text-2xl font-bold ms-4">2.2km</h3>
        </div>
      </div>

      {/* Pickup Address */}
      <div className="flex border-t-2 border-gray-300 py-3">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-map-pin-line"></i>
        </span>
        <div>
          <h3 className="font-semibold text-xl pb-1">{pickupMain}</h3>
          <h5 className="text-gray-500 text-md">{pickupDetails}</h5>
        </div>
      </div>

      {/* Destination Address */}
      <div className="flex border-t-2 border-gray-300 py-3">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-square-fill"></i>
        </span>
        <div>
          <h3 className="font-semibold text-xl pb-1">{destinationMain}</h3>
          <h5 className="text-gray-500 text-md">{destinationDetails}</h5>
        </div>
      </div>

      {/* Bill Info */}
      <div className="flex border-t-2 border-gray-300 py-3">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-bank-card-2-fill"></i>
        </span>
        <div className="w-full">
          <h3 className="font-semibold text-xl pb-1">₹{ride?.fare}</h3>
          <h3 className="text-gray-500 text-md">{ride?.paymentMethod}</h3>
        </div>
      </div>

      {/* Accept & Ignore Buttons */}
      <div className="flex justify-evenly items-center mt-2">
        <button
          onClick={() => {
            setConfirmRidePopUpPanel(true);
            confirmRide();
          }}
          className="w-48 py-2 bg-green-600 rounded-xl text-white font-bold text-xl mb-2"
        >
          Accept
        </button>

        <button
          onClick={() => setRidePopUpPanel(false)}
          className="w-48 py-2 bg-gray-400 rounded-xl text-white font-bold text-xl"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default RidePopUpPanel;

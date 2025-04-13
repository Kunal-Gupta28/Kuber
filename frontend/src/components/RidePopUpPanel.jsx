import React, { useContext, useState } from "react";
import { useCaptainContext } from "../context/CaptainContext";
import RideDetails from "./RideDetails";

const RidePopUpPanel = ({
  setRidePopUpPanel,
  setConfirmRidePopUpPanel,
  confirmRide,
}) => {
  const {
    pickupMain,
    pickupDetails,
    destinationMain,
    destinationDetails,
    ride,
  } = useCaptainContext();

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
              // src={ride?.user?.profilePicture || "/default-avatar.png"}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="text-2xl font-bold -ms-10">
            {/* {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname} */}
          </h3>

          <h3 className="text-2xl font-bold ms-4">2.2km</h3>
        </div>
      </div>

      <RideDetails />

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

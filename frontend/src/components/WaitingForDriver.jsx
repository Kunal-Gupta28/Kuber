import React from "react";
import { useRideContext } from "../context/RideContext";

const WaitingForDriver = () => {
  const {
    ride,
    pickupMain,
    pickupDetails,
    confirmRideDetails,
  } = useRideContext();

  if (!confirmRideDetails || !ride) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading ride details...
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
    <div>
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b-2">
        <span className="font-medium">Meet at the pickup point</span>
        <span className="bg-black text-white text-center px-3 font-thin">
          <span>2</span>
          <br />
          min
        </span>
      </div>

      {/* Driver and Vehicle Info */}
      <div>
        <div className="px-5 pt-4 flex justify-between items-center">
          {/* Driver and Vehicle Image */}
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
              {/* Optional driver image placeholder */}
              {/* <img src={ride?.driverImage || "/images/default-driver.png"} alt="Driver" className="h-full w-full object-cover" /> */}
              <i className="ri-user-line text-3xl text-white" />
            </div>
            <div className="h-20 w-20 rounded-full overflow-hidden flex justify-center items-center bg-gray-200">
              {confirmRideDetails.image ? (
                <img
                  src={confirmRideDetails.image}
                  className="h-16 w-16 object-contain"
                  alt="Vehicle"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-vehicle.png";
                  }}
                />
              ) : (
                <div className="h-16 w-16 bg-gray-300 rounded-full"></div>
              )}
            </div>
          </div>

          {/* Driver Info */}
          <div className="text-right font-medium">
            <h2 className="text-gray-400">{driverName}</h2>
            <h1 className="text-xl font-semibold">{vehiclePlate}</h1>
            <h2 className="text-gray-400">{vehicleModel}</h2>
            <h3 className="text-yellow-500 font-semibold">⭐ 4.3</h3>
          </div>
        </div>

        {/* OTP */}
        <div className="p-4 text-center text-2xl my-3 py-5 border font-bold animate-pulse">
          OTP : {otp}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-around p-4">
          <div className="flex flex-col items-center">
            <span className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
              <i className="ri-shield-line text-white text-xl"></i>
            </span>
            <h5 className="text-sm mt-2">Safety</h5>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
              <i className="ri-share-line text-white text-xl"></i>
            </span>
            <h5 className="text-sm mt-2">Share My Trip</h5>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
              <i className="ri-phone-line text-white text-xl"></i>
            </span>
            <h5 className="text-sm mt-2">Call Captain</h5>
          </div>
        </div>
      </div>

      {/* Pick-up Address */}
      <div className="flex border-t-2 border-gray-300 py-3 px-4 items-center">
        <span className="w-12 flex justify-center items-center">
          <i className="ri-map-pin-line text-xl"></i>
        </span>
        <div>
          <h3 className="font-semibold text-xl pb-1">{pickupMain}</h3>
          <h5 className="text-gray-500 text-md">{pickupDetails}</h5>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;

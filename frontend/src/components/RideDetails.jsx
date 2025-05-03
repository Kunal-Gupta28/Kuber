import React, { useState, useEffect } from "react";
import { useRideContext } from "../context/RideContext";
import axios from "axios"; 



const RideDetails = ({ userType, ride }) => {
  let confirmRideDetails, pickup, destination, distance, duration;

  if (userType === "captain") {
    confirmRideDetails = ride || {};
    pickup = ride?.pickup || null;
    destination = ride?.destination || null;
  } else {
    const {
      confirmRideDetails: rideDetails,
      pickup: ridePickup,
      destination: rideDestination,
      distance: rideDistance,
      duration: rideDuration,
    } = useRideContext() || {};
  
    confirmRideDetails = rideDetails;
    pickup = ridePickup;
    destination = rideDestination;
    distance = rideDistance;
    duration = rideDuration;
  }
  

  // Check if required data is available
  if (!confirmRideDetails || !pickup || !destination) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <p>Loading ride details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
  {/* Vehicle Details (Hide for captain) */}
  {userType !== "captain" && (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
      <div className="w-16 h-16 flex-shrink-0">
        <img
          src={confirmRideDetails.image || "/fallback.png"}
          alt={confirmRideDetails.vehicleType || "Vehicle"}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-lg font-semibold">{confirmRideDetails.vehicleType}</h3>
          <div className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full text-sm">
            <i className="ri-user-fill mr-1"></i>
            {confirmRideDetails.capacity}
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {confirmRideDetails.description}
        </p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          ₹{confirmRideDetails.fare || "--"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Estimated fare</p>
      </div>
    </div>
  )}

  {/* Trip Details */}
  <div className="space-y-4">
    {/* Pickup Location */}
    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full">
        <i className="ri-map-pin-fill text-green-600 dark:text-green-400"></i>
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pickup</p>
        <p className="font-medium">{pickup}</p>
      </div>
    </div>

    {/* Destination Location */}
    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full">
        <i className="ri-flag-fill text-red-600 dark:text-red-400"></i>
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Destination</p>
        <p className="font-medium">{destination}</p>
      </div>
    </div>
  </div>

  {/* Trip Summary */}
  <div className="px-4 py-2 xl:py-4  bg-gray-50 dark:bg-gray-800 rounded-xl">
    {/* Distance */}
  <div className="flex justify-between items-center mb-0 xl:mb-2">
    <span className="text-gray-600 dark:text-gray-300">Distance</span>
    <span className="font-medium">{distance ? `~${distance}` : "Calculating..."}</span>
  </div>

   {/* Duration */}
  <div className="flex justify-between items-center mb-0 xl:mb-2">
    <span className="text-gray-600 dark:text-gray-300">Duration</span>
    <span className="font-medium">{duration ? `~${duration} mins` : "Calculating..."}</span>
  </div>

    {userType !== "captain" && (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 dark:text-gray-300">Vehicle Type</span>
    <span className="font-medium">{confirmRideDetails.vehicleType}</span>
  </div>
)}

  </div>

  {/* Safety Info */}
  {userType !== "captain" && (<div className="flex justify-center items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm">
    <i className="ri-shield-check-line text-blue-600 dark:text-blue-400 text-xl"></i>
    <p className="text-gray-600 dark:text-gray-300">
      Your ride is covered by our safety measures and insurance
    </p>
  </div>)}
</div>

  );
};

export default RideDetails;

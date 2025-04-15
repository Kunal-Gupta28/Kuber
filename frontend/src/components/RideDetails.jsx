import React from "react";
import { useRideContext } from "../context/RideContext";
import { useCaptainContext } from "../context/CaptainContext";

const RideDetails = () => {
  const rideCtx = useRideContext();
  const captainCtx = useCaptainContext();

  const isCaptain = !!captainCtx?.captain;
  const data = isCaptain ? captainCtx : rideCtx;

  const {
    pickupMain,
    pickupDetails,
    destinationMain,
    destinationDetails,
    confirmRideDetails,
    fare,
  } = data || {};

  return (
    <div className="w-full">
      {/* Vehicle image */}
      {!isCaptain && (
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
      )}

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
          <h3 className="font-semibold text-xl pb-1">₹{fare}</h3>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;

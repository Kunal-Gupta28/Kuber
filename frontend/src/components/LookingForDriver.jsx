import React from "react";

const LookingForDriver = ({ pickup, destination,confirmRideDetails }) => {
  const splitAddress = (address) => {
    if (!address) return ["Unknown", ""];
    const parts = address.split(", ");
    return [parts[0], parts.slice(1).join(", ")];
  };
  
  const [pickupMain, pickupDetails] = splitAddress(pickup);
  const [destinationMain, destinationDetails] = splitAddress(destination);
  
  return (
    <div className="w-screen">
    <h2 className="text-center text-2xl font-semibold mb-5 pt-5 border-b-2">
      Looking for driver
    </h2>

    {/* selected vehicle image  */}
    <div className="my-2 py-5 flex justify-center relative ">
      <span className="h-20 w-64 bg-[#eff3fe] rounded-full flex justify-center">
        <span className="h-16 bg-[#d4e2fc] rounded-full w-44 flex justify-center">
          <img
            className="w-40 absolute top-[-8%]"
            src={confirmRideDetails.image}
          />
        </span>
      </span>
    </div>

      {/* pick-up address */}
      <div className="flex border-t-2 border-grey py-3">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-map-pin-line"></i>
        </span>
        <div>
          <h3 className="font-semibold text-xl pb-1">{pickupMain}</h3>
          <h5 className="text-gray-500 text-md">
          {pickupDetails}{" "}
          </h5>
        </div>
      </div>

      {/* destination */}
      <div className="flex">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-square-fill"></i>
        </span>
        <div className="border-t-2 border-grey py-3">
          <h3 className="font-semibold text-xl pb-1">{destinationMain}</h3>
          <h5 className="text-gray-500 text-md">
           {destinationDetails}
          </h5>
        </div>
      </div>

    {/* bill info */}
    <div className="flex">
      <span className="w-16 flex justify-center items-center">
        <i className="ri-bank-card-2-fill"></i>
      </span>
      <div className="w-full border-t-2 border-grey py-3">
        <h3 className="font-semibold text-xl pb-1">
          ₹{confirmRideDetails.fare}
        </h3>
        <h3 className="text-gray-500 text-md"> Cash </h3>
      </div>
    </div>

  </div>
  )
}

export default LookingForDriver

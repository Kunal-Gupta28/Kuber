import React from "react";

const WaitingForDriver = (profs) => {
  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center p-3 border-b-2">
        <span className="font-medium">Meet at the pickup point</span>
        <span className="bg-black text-white text-center px-3 font-thin">
          <span>2</span>
          <br />
          min
        </span>
      </div>

      {/* driver and vehicle image */}
      <div>
        <div className="px-5 pt-4 flex justify-between">
          <span className="flex">
            <div className="h-24 w-24 rounded-full bg-red-300 me-[-20%] z-[5]">
              <img src="" alt="" />
            </div>
            <div className="h-24 w-24 rounded-full flex justify-center items-center">
              <img src={profs.confirmRideDetails.image} className="h-28" />
            </div>
          </span>
          <span className="text-right font-medium"><h2 className="text-gray-400">SANTH</h2>
          <h1 className="text-xl font-semibold">KA15AK00-0</h1>
          <h2  className="text-gray-400">White sukuki s-persoo LXI</h2>
          <span><h3>4.3</h3></span>
          </span>
        </div>
        <div>
          <textarea name="" id=""></textarea>
        </div>
        <div className="flex">
          <div>
            <span className="w-96 h-96 bg-gray-400 rounded-ful"></span>
            <h5>Saftey</h5>
          </div>
          <div>
            <span className="w-96 h-96 bg-gray-400 rounded-ful"></span>
            <h5>Share my trip</h5>
          </div>
          <div>
            <span className="w-96 h-96 bg-gray-400 rounded-ful"></span>
            <h5>Call Captain</h5>
          </div>
        </div>
      </div>
      {/* pick-up address */}
      <div className="flex border-t-2 border-grey py-3">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-map-pin-line"></i>
        </span>
        <div>
          {/* {profs.confirmRideDetails.address}{" "} */}
          <h3 className="font-semibold text-xl pb-1">562/11-A</h3>
          <h5 className="text-gray-500 text-md">
            Kalkondrahalli, Bengaluru, karnataka
          </h5>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
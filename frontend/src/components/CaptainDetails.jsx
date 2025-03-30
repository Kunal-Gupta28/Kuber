import React from "react";

const CaptainDetails = () => {
  return (
    <div>
      {/* details */}
      <div className="h-2/5 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-24 w-24 rounded-full bg-red-200">
              <img src="" alt="" />
            </div>
            <h3 className="text-2xl font-bold ms-4">Harsh Patel</h3>
          </div>
          <div>
            <h2 className="text-2xl font-bold">₹254.20</h2>
            <p className="text-gray-500">Earned</p>
          </div>
        </div>

        {/* details */}
        <div className="bg-gray-100 flex justify-between p-4 mt-10">
          <div className="text-center">
            <i className="ri-time-line text-3xl"></i>
            <h3 className="mt-2 text-xl font-semibold">10.2</h3>
            <h3 className="text-gray-700">Hours Online</h3>
          </div>
          <div className="text-center">
            <i className="ri-speed-up-fill text-3xl"></i>
            <h3 className="mt-2 text-xl font-semibold">10.2</h3>
            <h3 className="text-gray-700">Hours Online</h3>
          </div>
          <div className="text-center">
            <i className="ri-booklet-line text-3xl"></i>
            <h3 className="mt-2 text-xl font-semibold">10.2</h3>
            <h3 className="text-gray-700">Hours Online</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;

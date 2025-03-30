import React, { useState } from "react";
import { Link } from "react-router-dom";

const ConfirmRidePopUpPanel = (props) => {
  const [OTP, setOTP] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <div className="w-screen">
      <div className="text-center">
        <i
          onClick={() => props.setConfirmRidePopUpPanel(false)}
          className="ri-arrow-down-wide-fill text-3xl text-gray-400"
        ></i>
      </div>

      <h2 className="text-center text-2xl font-semibold pt-5">
        Confirm this ride to start
      </h2>

      {/* details */}
      <div className=" my-4 px-5">
        <div className="flex justify-between items-center px-5 py-3 rounded-xl bg-gray-200">
          <div className="h-20 w-20 rounded-full bg-red-200">
            <img src="" alt="" />
          </div>
          <h3 className="text-2xl font-bold ms-4">2.2km</h3>
        </div>
      </div>

      {/* pick-up address */}
      <div className="flex border-t-2 border-grey py-3">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-map-pin-line"></i>
        </span>
        <div>
          {/* {confirmRideDetails.address}{" "} */}
          <h3 className="font-semibold text-xl pb-1">562/11-A</h3>
          <h5 className="text-gray-500 text-md">
            Kalkondrahalli, Bengaluru, karnataka
          </h5>
        </div>
      </div>

      {/* destination */}
      <div className="flex">
        <span className="w-16 flex justify-center items-center">
          <i className="ri-square-fill"></i>
        </span>
        <div className="border-t-2 border-grey py-3">
          <h3 className="font-semibold text-xl pb-1">third wabe congee</h3>
          <h5 className="text-gray-500 text-md">
            17th Cross Pd, Pes quality,1ast selcto, Hsst layout, benfaluru,
            karnataka
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
            {/* ₹{confirmRideDetails.price} */}
          </h3>
          <h3 className="text-gray-500 text-md"> Cash </h3>
        </div>
      </div>

      <form
        action=""
        onSubmit={(e) => {
          submitHandler(e);
        }}
      >
        {/* OTP */}
        <input
          onChange={(e) => {
            setOTP(e.target.value);
          }}
          value={OTP}
          type="text"
          placeholder="Enter a OTP"
          className="bg-[#eee] px-6 py-4 font-mono text-lg mt-5 mx-auto rounded-xl block"
        />

        {/* confirm button */}
        <Link
          to="/captains-riding"
          onClick={() => {
            props.setRidePopUpPanel(false);
            props.setConfirmRidePopUpPanel(false);
          }}
          className="w-48 mx-auto block mt-6 py-2 bg-green-600 rounded-xl text-white font-bold text-xl text-center"
        >
          Confirm
        </Link>

        {/*  cancel button */}
        <button
          onClick={() => {
            props.setRidePopUpPanel(false);
            props.setConfirmRidePopUpPanel(false);
          }}
          className="w-48 mx-auto block mt-4 py-2 bg-red-400 rounded-xl text-white font-bold text-xl"
        >
          {" "}
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ConfirmRidePopUpPanel;

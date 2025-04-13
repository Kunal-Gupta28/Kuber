import axios from "axios";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCaptainContext } from "../context/CaptainContext";
import RideDetails from "../components/RideDetails";

const ConfirmRidePopUpPanel = ({
  setRidePopUpPanel,
  setConfirmRidePopUpPanel,
}) => {
  const {
    pickupMain,
    pickupDetails,
    destinationMain,
    destinationDetails,
    ride,
  } = useCaptainContext();
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(OTP)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
      {
        params: { rideId: ride._id, otp: OTP },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    if (response.status === 200) {
      setConfirmRidePopUpPanel(false);
      setRidePopUpPanel(false);
      navigate("/captains/riding", {
        state: {
          ride,
          pickupMain,
          pickupDetails,
          destinationMain,
          destinationDetails,
        },
      });
    }

    setError("");
    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(false);
  };

  return (
    <div className="w-screen">
      <div className="text-center">
        <i
          onClick={() => setConfirmRidePopUpPanel(false)}
          className="ri-arrow-down-wide-fill text-3xl text-gray-400 cursor-pointer"
        ></i>
      </div>

      <h2 className="text-center text-2xl font-semibold">
        Confirm this ride to start
      </h2>

      {/* Ride Details */}
      <div className="my-4 px-5">
        <div className="flex justify-between items-center px-5 py-3 rounded-xl bg-gray-200">
          <div className="h-20 w-20 rounded-full bg-red-200">
            <img src="" alt="" />
          </div>
          <h3 className="text-2xl font-bold -ms-10">
            {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
          </h3>
          <h3 className="text-2xl font-bold ms-4">2.2km</h3>
        </div>
      </div>

      {/* ride details */}
      <RideDetails />

      <form onSubmit={submitHandler}>
        {/* OTP Input */}
        <input
          type="text"
          value={OTP}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value) && value.length <= 6) {
              setOTP(value);
              setError("");
            }
          }}
          placeholder="Enter 6-digit OTP"
          className="bg-[#eee] px-6 py-4 font-mono text-lg mt-5 mx-auto rounded-xl block text-center"
          maxLength="6"
        />
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {/* Confirm Button */}
        <div className="flex justify-evenly">
          <button
            type="submit"
            className="w-48 mx-auto block mt-6 py-2 bg-green-600 rounded-xl text-white font-bold text-xl text-center"
          >
            Confirm
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => {
              setRidePopUpPanel(false);
              setConfirmRidePopUpPanel(false);
            }}
            className="w-48 mx-auto block mt-4 py-2 bg-red-400 rounded-xl text-white font-bold text-xl"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmRidePopUpPanel;

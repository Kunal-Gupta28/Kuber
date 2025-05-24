import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RideDetails from "../components/RideDetails";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRideContext } from "../context/RideContext";

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
  } = useRideContext();
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!/^\d{6}$/.test(OTP)) {
      setError("OTP must be exactly 6 digits");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: { rideId: ride._id, otp: OTP },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        toast.success("Ride started successfully!");
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
    } catch (error) {
      toast.error("Failed to start ride. Please try again.");
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 120 }}
      className="w-full h-full  bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-t-3xl shadow-xl text-black dark:text-white"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Confirm Ride
        </h2>
        <button
          onClick={() => setConfirmRidePopUpPanel(false)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      {/* User Info */}
      <div className="mb-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
              <img
                src={ride?.user?.image || "/default-avatar.png"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
              {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">2.2km away</p>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className="mb-6">
        <RideDetails userType="captain" ride={ride} />
      </div>

      {/* OTP Form */}
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter OTP
          </label>
          <div className="relative">
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-center text-lg font-mono focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-colors"
              maxLength="6"
            />
            {error && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-xl text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Starting Ride...
              </>
            ) : (
              <>
                <i className="ri-check-line"></i>
                Start Ride
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setRidePopUpPanel(false);
              setConfirmRidePopUpPanel(false);
            }}
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl text-gray-800 dark:text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            <i className="ri-close-line"></i>
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ConfirmRidePopUpPanel;

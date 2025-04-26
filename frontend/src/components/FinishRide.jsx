import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RideDetails from "./RideDetails";
import {useCaptainContext} from '../context/CaptainContext' 

const FinishRide = (props) => {
  const {ride} = useCaptainContext()

  const navigate = useNavigate();

  async function endRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
      {
        rideId: ride._id,
      },
      { headers: { Authorization: `bearer ${localStorage.getItem("token")}` } }
    );

    if (response.status === 200) {
      navigate("/captains/home");
    }
  }
  return (
    <div className="w-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="text-center">
        <i
          onClick={() => props.setFinishRidePanel(false)}
          className="ri-arrow-down-wide-fill text-3xl text-gray-400 dark:text-gray-500"
        ></i>
      </div>

      <h2 className="text-center text-2xl font-semibold pt-5">
        Finish this Ride
      </h2>

      {/* details */}
      <div className="my-4 px-5">
        <div className="flex justify-between items-center px-5 py-3 rounded-xl bg-gray-200 dark:bg-gray-800">
          <div className="h-20 w-20 rounded-full bg-red-200 dark:bg-red-900">
            <img src="" alt="" />
          </div>
          <h3 className="text-2xl font-bold ms-4">2.2km</h3>
        </div>
      </div>

      <RideDetails />

      {/* confirm button */}
      <button
        onClick={endRide}
        className="w-48 mx-auto block mt-6 py-2 bg-green-600 dark:bg-green-700 rounded-xl text-white font-bold text-xl text-center hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
      >
        Finish Ride
      </button>
    </div>
  );
};

export default FinishRide;

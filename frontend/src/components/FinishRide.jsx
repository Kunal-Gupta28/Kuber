import React from "react";
import { useNavigate ,useLocation } from "react-router-dom";
import axios from 'axios'

const FinishRide = (props) => {
  const location = useLocation();
  const state = location.state || {};
  const { pickupMain, pickupDetails, destinationMain, destinationDetails, ride } = state;
  const fare = ride?.fare;
  const navigate = useNavigate()
  
  async function endRide(){
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`,{
      rideId:ride._id
    },{headers:{Authorization:`bearer ${localStorage.getItem('token')}`}})

    if(response.status === 200){
      navigate('/captains/home')
    }
  }
  return (
    <div className=" w-screen">
      <div className="text-center">
        <i
          onClick={() => props.setFinishRidePanel(false)}
          className="ri-arrow-down-wide-fill text-3xl text-gray-400"
        ></i>
      </div>

      <h2 className="text-center text-2xl font-semibold pt-5">
        Finish this Ride
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
          <h3 className="font-semibold text-xl pb-1">{pickupMain}</h3>
          <h5 className="text-gray-500 text-md">
            {pickupDetails}
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
            ₹{fare}
          </h3>
          <h3 className="text-gray-500 text-md"> Cash </h3>
        </div>
      </div>

        {/* confirm button */}
        <button
          onClick={endRide}
          className="w-48 mx-auto block mt-6 py-2 bg-green-600 rounded-xl text-white font-bold text-xl text-center"
        >
          Finish Ride
        </button>
    </div>
  );
};

export default FinishRide;

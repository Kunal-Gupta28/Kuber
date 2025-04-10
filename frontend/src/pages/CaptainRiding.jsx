import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import FinishRide from "../components/FinishRide";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const finishRidePanelRef = useRef(null);

  const location = useLocation();
  const state = location.state || {};
  const { ride } = state;
  const { pickup, destination } = ride;

  const getAddressCoordinates = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/getAddressCoordinates`,
        {
          params: {
            userType: "captain",
            pickup: pickup,
            destination: destination,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCoordinates({
        pickup: response.data.pickup,
        destination: response.data.destination,
      });
    } catch (error) {
      console.error("❌ Error fetching reverse geocode:", error);
    }
  };

  // 👉 Call geocode fetch on component mount
  useEffect(() => {
    getAddressCoordinates();
  }, []);

  useGSAP(
    () => {
      gsap.to(finishRidePanelRef.current, {
        transform: finishRidePanel ? "translateY(0%)" : "translateY(100%)",
      });
    },
    [finishRidePanel]
  );

  return (
    <div className="h-screen">
      {/* kuber logo and exit button */}
      <div className="flex justify-between fixed p-5 w-full text-2xl z-20">
        <h2>Kuber</h2>
        <span className="bg-white p-2 rounded-full">
          <i className="ri-logout-box-r-line"></i>
        </span>
      </div>

      {/* map */}
      <div onClick={() => setFinishRidePanel(false)} className="h-4/5 overflow-hidden">
        <LiveTracking coordinates={coordinates} />
      </div>

      {/* bottom panel */}
      <div onClick={() => setFinishRidePanel(true)} className="h-1/5 pt-2 bg-yellow-400 p-5">
        <h3 className="text-center">
          <i className="ri-arrow-up-wide-fill text-3xl"></i>
        </h3>
        <div className="h-3/5 flex justify-between items-center">
          <h3 className="text-2xl font-semibold">4 Km away</h3>
          <button className="h-16 w-48 bg-green-600 rounded-xl text-xl font-semibold text-white">
            Complete Ride
          </button>
        </div>
      </div>

      {/* Slide-up panel */}
      <div
        ref={finishRidePanelRef}
        className="h-[75%] fixed bottom-0 translate-y-full bg-white"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;

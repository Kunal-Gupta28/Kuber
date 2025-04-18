import React, { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUpPanel from "../components/RidePopUpPanel";
import ConfirmRidePopUpPanel from "../components/ConfirmRidePopUpPanel";
import { useCaptainContext } from "../context/CaptainContext";
import { SocketContext } from "../context/socketContext";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import CaptainLogout from "./CaptainLogout";

const CaptainHome = () => {
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);

  const { socket } = useContext(SocketContext);
  const { captain, ride, setRide } = useCaptainContext();

  async function confirmRide() {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRidePopUpPanel(false);
      setConfirmRidePopUpPanel(true);
    } catch (error) {
      console.error("Error confirming ride:", error);
    }
  }

  useEffect(() => {
    if (!captain) return;

    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
    };

    const intervalId = setInterval(updateLocation, 10000);
    updateLocation();

    socket.on("new-ride", (data) => {
      setRide(data);
      setRidePopUpPanel(true);
    });

    return () => {
      clearInterval(intervalId);
      socket.off("new-ride");
    };
  }, [captain]);

  // GSAP Animations
  useGSAP(() => {
    gsap.to(ridePopUpPanelRef.current, {
      y: ridePopUpPanel ? "2%" : "100%",
      duration: 0.5,
      ease: "power2.out",
    });
  }, [ridePopUpPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopUpPanelRef.current, {
      y: confirmRidePopUpPanel ? 0 : "100%",
      duration: 0.5,
      ease: "power2.out",
    });
  }, [confirmRidePopUpPanel]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col relative">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center p-4 text-xl z-20 absolute top-0">
        <h2 className="font-bold">Kuber</h2>
        <CaptainLogout />
      </div>

      {/* Main content: Map + CaptainDetails */}
      <div className="flex-1 flex flex-col h-full">
        {/* Live Tracking */}
        <div className="h-[70%]">
          <LiveTracking />
        </div>

        {/* Captain Details */}
        <div className="h-[30%] overflow-hidden">
          <CaptainDetails captain={captain} />
        </div>
      </div>

      {/* Ride Popup Panel */}
      <div
        ref={ridePopUpPanelRef}
        className="fixed bottom-0 left-0 w-full z-30 bg-white h-[70%] translate-y-full"
      >
        <RidePopUpPanel
          confirmRide={confirmRide}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>

      {/* Confirm Ride Panel */}
      <div
        ref={confirmRidePopUpPanelRef}
        className="h-[80%] w-full fixed bottom-0 left-0 z-30 bg-white translate-y-full"
      >
        <ConfirmRidePopUpPanel
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;

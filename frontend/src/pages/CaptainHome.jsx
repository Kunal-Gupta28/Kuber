import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NavBar from "../components/Navbar";
import LiveTracking from "../components/LiveTracking";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUpPanel from "../components/RidePopUpPanel";
import ConfirmRidePopUpPanel from "../components/ConfirmRidePopUpPanel";

// context
import { useCaptainContext } from "../context/CaptainContext";
import { SocketContext } from "../context/socketContext";
import { useRideContext } from "../context/RideContext";

const CaptainHome = () => {
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);
  const menuRef = useRef(null);

  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [isMenuOpen] = useState(false);

  const { socket } = useContext(SocketContext);
  // const { captain, ride ,setRide } = useCaptainContext();
  const { captain } = useCaptainContext();
  const { ride, setRide } = useRideContext()

  const navigate = useNavigate();
  const [setActiveRide] = useState(null);

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

    const intervalId = setInterval(updateLocation, 100000000);
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

  useEffect(() => {
    const handleRideRequest = (ride) => {
      toast.success("New ride request received!");
      setActiveRide(ride);
    };

    socket?.on("ride-request", handleRideRequest);
    return () => socket?.off("ride-request", handleRideRequest);
  }, [socket]);


  const confirmRide = async (rideId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        { rideId:ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.success) {
        navigate("/captains/riding", {
          state: { ride: response.data.ride },
        });
      }
    } catch (error) {
      toast.error("Failed to accept ride");
    }
  };

  // GSAP animations
  useGSAP(() => {
    if (ridePopUpPanelRef.current) {
      gsap.to(ridePopUpPanelRef.current, {
        y: ridePopUpPanel ? "2%" : "100%",
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [ridePopUpPanel]);
  
  useGSAP(() => {
    if (confirmRidePopUpPanelRef.current) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        y: confirmRidePopUpPanel ? "0%" : "100%",
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [confirmRidePopUpPanel]);
  
  useGSAP(() => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: isMenuOpen ? 1 : 0,
        y: isMenuOpen ? 0 : -100,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isMenuOpen]);
  

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col bg-gray-100 dark:bg-gray-900 relative">
      {/* Top Navigation */}
      <NavBar userType="captain" isCaptain={true} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Live Map Section */}
        <div className="h-[72%] bg-gray-200 dark:bg-gray-800">
          <LiveTracking />
        </div>

        {/* Captain Info */}
        <div className="h-[28%] overflow-hidden bg-white dark:bg-gray-800 shadow-inner">
          <CaptainDetails captain={captain} />
        </div>
      </div>

      {/* Incoming Ride Panel */}
      <div
        ref={ridePopUpPanelRef}
        className="fixed bottom-0 left-0 w-full z-30 bg-white dark:bg-gray-800 translate-y-full rounded-t-2xl shadow-xl transition-all duration-300"
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
        className="h-full w-full fixed bottom-0 left-0 z-30 bg-white dark:bg-gray-800 translate-y-full rounded-t-2xl shadow-xl transition-all duration-300"
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

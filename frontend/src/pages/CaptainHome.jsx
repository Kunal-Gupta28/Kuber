import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUpPanel from "../components/RidePopUpPanel";
import ConfirmRidePopUpPanel from "../components/ConfirmRidePopUpPanel";

const CaptainHome = () => {
  const ridePopUpPanelRef = useRef(null);
  const [ridePopUpPanel, setRidePopUpPanel] = useState(true);

  const confirmRidePopUpPanelRef = useRef(null);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);

  // ridePopUpPanel panel animaiton
  useGSAP(() => {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(ridePopUpPanelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [ridePopUpPanel]);

  // ridePopUpPanel panel animaiton
  useGSAP(() => {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [confirmRidePopUpPanel]);

  return (
    <div className="h-screen">
      {/* kuber logo and exist button */}
      <div className="flex justify-between fixed p-5 w-full text-2xl">
        <h2>Kuber</h2>
        <span className="bg-white p-2 rounded-full">
          <i className="ri-logout-box-r-line"></i>
        </span>
      </div>
      {/* map */}
      <div className="h-3/5 overflow-hidden">
        <img
          className="object-cover"
          src="https://www.uberpeople.net/attachments/f0d80c4c-0028-4900-aeed-b67168c657b2-jpeg.667694/"
        />
      </div>

      <CaptainDetails />

      {/* ridePopUpPanel  */}
      <div
        ref={ridePopUpPanelRef}
        className="h-[75%] fixed w-full z-10 bottom-0 translate-y-full bg-white"
      >
        <RidePopUpPanel
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>

      {/* confrim ridePopUpPanel  */}
      <div
        ref={confirmRidePopUpPanelRef}
        className="h-screen fixed w-full z-10 bottom-0 translate-y-full bg-white"
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

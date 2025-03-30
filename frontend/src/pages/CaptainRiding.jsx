import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import FinishRide from "../components/FinishRide";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: 'translateY(0%)'
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: 'translateY(100%)'
        });
      }
    },
    [finishRidePanel]
  );
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
      <div onClick={()=>[setFinishRidePanel(false)]} className="h-4/5 overflow-hidden">
        <img
          className="object-cover"
          src="https://www.uberpeople.net/attachments/f0d80c4c-0028-4900-aeed-b67168c657b2-jpeg.667694/"
        />
      </div>

      {/*  */}
      <div onClick={()=>setFinishRidePanel(true)} className="h-1/5 pt-2 bg-yellow-400 p-5">
        <h3 className="text-center">
          <i className="ri-arrow-up-wide-fill text-3xl"></i>
        </h3>
        <div className=" h-3/5 flex justify-between items-center">
          <h3 className="text-2xl font-semibold">4 Km away</h3>
          <button className="h-16 w-48 bg-green-600 rounded-xl text-xl font-semibold text-white">
            Complete Ride
          </button>
        </div>
      </div>

      <div ref={finishRidePanelRef} className="h-[75%] fixed bottom-0 translate-y-full bg-white">
        <FinishRide setFinishRidePanel={setFinishRidePanel}/>
      </div>
    </div>
  );
};

export default CaptainRiding;

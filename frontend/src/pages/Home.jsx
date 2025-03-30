import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import LocationSearchPanel from "../components/LocationSearchPanel";
import Vehicle from "../components/Vehicle";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isPickupSelected, setIsPickupSelected] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const panelOpenRef = useRef(null);
  const panelCloseRef = useRef(null);

  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const vehiclePanelOpenRef = useRef(null);
  const vehiclePanelCloseRef = useRef(null);

  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const confirmRidePanelRef = useRef(null);
  const [confirmRideDetails, setConfirmRideDetails] = useState({});

  const vehicleFoundRef = useRef(null);
  const [vehicleFound, setVehicleFound] = useState(false);

  const waitingForDriverRef = useRef(null);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  // from submitHandler
  const submitHandler = (e) => {
    e.preventDefault();
  };

  // PanelOpen     :     location panel animation
  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelOpenRef.current, {
          height: "70%",
          duration: 0.5,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
          duration: 0.5,
        });
      } else {
        gsap.to(panelOpenRef.current, {
          height: "0%",
          duration: 0.5,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
          duration: 0.5,
        });
      }
    },
    [panelOpen]
  );

  // vehiclePanelopen  :  vehicle panel animation
  useGSAP(
    function () {
      if (vehiclePanelOpen) {
        setPanelOpen(false);
        gsap.to(vehiclePanelOpenRef.current, {
          transform: "translateY(0%)",
          duration: 0.5,
        });
        gsap.to(vehiclePanelCloseRef.current, {
          opacity: 1,
          duration: 0.5,
        });
      } else {
        gsap.to(vehiclePanelOpenRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
        gsap.to(vehiclePanelCloseRef.current, {
          opacity: 0,
          duration: 0.5,
        });
      }
    },
    [vehiclePanelOpen]
  );

  // confirm ride panel    :    confirm ride animation
  useGSAP(
    function () {
      if (confirmRidePanel) {
        setVehiclePanelOpen(false);
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0%)",
          duration: 0.5,
        });
        gsap.to(vehiclePanelCloseRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
      }
    },
    [confirmRidePanel]
  );

  // looking for rides
  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0%)",
          duration: 0.5,
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
      }
    },
    [vehicleFound]
  );

  // waitng for drive panel animation
  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0%)",
          duration: 0.5,
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
      }
    },
    [waitingForDriver]
  );

  return (
    <div className="h-screen relative overflow-hidden">
      {/* logo */}
      <p className="fixed p-2 text-xl font-semibold">Kuber</p>

      {/* map */}
      <img
        className="h-screen"
        src="https://www.uberpeople.net/attachments/f0d80c4c-0028-4900-aeed-b67168c657b2-jpeg.667694/"
        alt=""
      />

      <div className="h-screen w-full flex flex-col justify-end absolute top-0">
        {/* pickup and destination */}
        <div className="h-[30%] bg-white relative w-full p-5">
          <div className="flex justify-between">
            <h4 className="text-2xl font-semibold ">Find a trip</h4>

            {/* close button for panel */}
            <div
              onClick={() => {
                setPanelOpen(false);
              }}
            >
              <i
                ref={panelCloseRef}
                className="ri-arrow-down-wide-fill text-2xl opacity-0"
              ></i>
            </div>
          </div>

          {/* pickup and destination  */}
          <form
            action=""
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            {/* vertical bar */}
            <div className="line absolute bg-gray-900 h-16 w-1 top-[30%] left-10 rounded-full"></div>

            {/* pickup */}
            <input
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-5 "
              type="text"
              onClick={() => {
                setPanelOpen(true);
                setIsPickupSelected(true);
              }}
              onChange={async (e) => {
                setPickup(e.target.value);
                if (e.target.value.length > 2) {
                  try {
                    const response = await axios.get(
                      `${import.meta.env.VITE_BASE_URL}/maps/get-suggestion`,
                      {
                        params: { input: e.target.value },
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );
                    setSuggestion(response.data);
                  } catch (error) {
                    console.error("Error fetching suggestions:", error);
                  }
                }
              }}
              value={pickup}
              placeholder="Add a pick-up location"
            />

            {/* destination */}
            <input
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3 "
              type="text"
              onClick={() => {
                setPanelOpen(true);
                setIsPickupSelected(false);
              }}
              onChange={async (e) => {
                setDestination(e.target.value);
                if (e.target.value.length > 2) {
                  try {
                    let response = await axios.get(
                      `${import.meta.env.VITE_BASE_URL}/maps/get-suggestion`,
                      {
                        params: { input: e.target.value },
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );
                    setSuggestion(response.data);
                  } catch (error) {
                    console.error("Error fetching suggestions:", error);
                  }
                }
              }}
              value={destination}
              placeholder="Enter destination"
            />

            {/* ride timming and  Find trip button */}
            <div className="flex justify-between px-4">
              {/* pickup timing */}
              <div className="bg-[#eee] rounded-3xl w-28 mt-5 p-2">
                <p className="text-center font-semibold">leave now </p>
              </div>

              {/* ride confirm button */}
              <button
                className="w-28 mt-5 p-2 bg-[#eee] rounded-full font-semibold"
                onClick={() => setVehiclePanelOpen(true)}
              >
                {" "}
                Find Trip
              </button>
            </div>
          </form>
        </div>

        {/* location history and suggestions */}
        <div ref={panelOpenRef} className="h-[0%] w-full  bg-white">
          <LocationSearchPanel
            suggestion={suggestion}
            isPickupSelected={isPickupSelected}
            setPickup={setPickup}
            setDestination={setDestination}
          />
        </div>

        {/* vehicle info */}
        <div
          ref={vehiclePanelOpenRef}
          className="px-5 w-full absolute bottom-0 translate-y-[100%] bg-white"
        >
          {/* close button for panel */}
          <div className="flex justify-between mt-5">
            <h3 className="text-2xl font-semibold">Choose a Vehicle</h3>
            <div
              onClick={() => {
                setVehiclePanelOpen(false);
                setPanelOpen(true);
              }}
            >
              <i
                ref={vehiclePanelCloseRef}
                className="ri-arrow-down-wide-fill text-2xl opacity-0"
              ></i>
            </div>
          </div>

          {/* {vehicle.map((detail) => (
            <Vehicle
              key={detail.category}
              pickup={pickup}
              destination={destination}
              image={detail.image}
              category={detail.category}
              capacity={detail.capacity}
              minsAway={detail.minsAway}
              time={detail.time}
              description={detail.description}
              price={detail.price}
              confirmRidePanel={confirmRidePanel}
              setConfirmRidePanel={setConfirmRidePanel}
              setConfirmRideDetails={setConfirmRideDetails}
            />
          ))} */}
                  <Vehicle
                   pickup={pickup}
                   destination={destination}
              confirmRidePanel={confirmRidePanel}
              vehiclePanelOpen={vehiclePanelOpen}
              setConfirmRidePanel={setConfirmRidePanel}
              setConfirmRideDetails={setConfirmRideDetails}
            />
        </div>

        {/* confirm ride */}
        <div
          ref={confirmRidePanelRef}
          className="fixed w-full z-10 bottom-0 translate-y-full bg-white"
        >
          <ConfirmRide
            setConfirmRidePanel={setConfirmRidePanel}
            confirmRideDetails={confirmRideDetails}
            setVehicleFound={setVehicleFound}
          />
        </div>

        {/* looking for driver */}
        <div
          ref={vehicleFoundRef}
          className="h-[60%] fixed w-full z-10 bottom-0 translate-y-full bg-white"
        >
          <LookingForDriver confirmRideDetails={confirmRideDetails} />
        </div>

        {/* Waiting for driver */}
        <div className="h-[60%] fixed w-full z-10 bottom-0 translate-y-full bg-white">
          <WaitingForDriver
            ref={waitingForDriverRef}
            confirmRideDetails={confirmRideDetails}
            setWaitingForDriver={setWaitingForDriver}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

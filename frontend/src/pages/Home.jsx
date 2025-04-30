import { useState, useRef, useContext, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import axios from "axios";

// Components
import LiveTracking from "../components/LiveTracking";
import LocationSearchPanel from "../components/LocationSearchPanel";
import Vehicle from "../components/Vehicle";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import NavBar from "../components/Navbar";
import Loader from "../components/Loader";

// Contexts
import { SocketContext } from "../context/socketContext";
import { UserDataContext } from "../context/UserContext";
import { useRideContext } from "../context/RideContext";

const Home = () => {
  const { pickup, setPickup, destination, setDestination, setRide } = useRideContext();
  const [suggestion, setSuggestion] = useState("");
  const [isPickupSelected, setIsPickupSelected] = useState(false);
  const topBarRef = useRef(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelOpenRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const vehiclePanelOpenRef = useRef(null);
  const vehiclePanelCloseRef = useRef(null);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const [vehicleFound, setVehicleFound] = useState(false);
  const waitingForDriverRef = useRef(null);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);
  const [isMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const lineRef = useRef(null);
  const pickupInputRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);


  const handleUseMyLocation = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            const userCoordinates = `${coords.latitude}, ${coords.longitude}`;
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/maps/getReverseGeocode`,
                {
                  params: { userCoordinates },
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              if (response?.data?.address) {
                setPickup(response.data.address);
                resolve(response.data.address);
              } else {
                reject(new Error("No address found"));
              }
            } catch (error) {
              console.error("Error reverse geocoding:", error);
              reject(error);
            }
          },
          (err) => {
            console.error("Geolocation error:", err);
            reject(err);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser"));
      }
    });
  };

  {isLocating && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
      <Loader message="Getting your location, please wait..." />
    </div>
  )}
  
  

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });

    socket.on("ride-confirmed", (ride) => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    });

    socket.on("ride-start", (ride) => {
      setWaitingForDriver(false);
      navigate("/users/riding", {
        state: { ride },
      });
    });

    return () => {
      socket.off("ride-confirmed");
      socket.off("ride-start");
    };
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/getAddressCoordinates`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem("coordinates", JSON.stringify(response.data));
    } catch (error) {
      console.error(
        "Error fetching coordinates:",
        error.response?.data || error.message
      );
    }
  };

  // Position line relative to pickup input
  useLayoutEffect(() => {
    if (pickupInputRef.current && lineRef.current) {
      const rect = pickupInputRef.current.getBoundingClientRect();
      const parentRect = pickupInputRef.current.offsetParent.getBoundingClientRect();

      gsap.set(lineRef.current, {
        top: rect.top - parentRect.top + rect.height / 2.1,
        left: rect.left - parentRect.left + 45,
        transform: "translateY(10%)",
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (topBarRef.current) {
      gsap.to(topBarRef.current, {
        zIndex: panelOpen ? 0 : 10,
        opacity: panelOpen ? 0 : 1,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (panelOpenRef.current && panelCloseRef.current) {
      gsap.to(panelOpenRef.current, {
        height: panelOpen ? "68dvh" : "0dvh",
        display: panelOpen ? "block" : "none",
        duration: 0.5,
      });
      gsap.to(panelCloseRef.current, {
        opacity: panelOpen ? 1 : 0,
        duration: 0.5,
      });
    }
  }, [panelOpen]);
  

  useGSAP(() => {
    if (vehiclePanelOpenRef.current && vehiclePanelCloseRef.current) {
      gsap.to(vehiclePanelOpenRef.current, {
        transform: vehiclePanelOpen ? "translateY(0%)" : "translateY(100%)",
        duration: 0.5,
      });
      gsap.to(vehiclePanelCloseRef.current, {
        opacity: vehiclePanelOpen ? 1 : 0,
        duration: 0.5,
      });
    }
  }, [vehiclePanelOpen]);

  useGSAP(() => {
    if (confirmRidePanelRef.current) {
      gsap.to(confirmRidePanelRef.current, {
        transform: confirmRidePanel ? "translateY(0%)" : "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFoundRef.current) {
      gsap.to(vehicleFoundRef.current, {
        transform: vehicleFound ? "translateY(0%)" : "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriverRef.current) {
      gsap.to(waitingForDriverRef.current, {
        y: waitingForDriver ? 0 : "100%",
        duration: 0.5,
        ease: waitingForDriver ? "power2.out" : "power2.in",
      });
    }
  }, [waitingForDriver]);

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
    <div className="h-[100dvh] w-full bg-white dark:bg-gray-900 text-black dark:text-white overflow-clip">
      
      
      
      {/* nav bar */}
      {!panelOpen && <NavBar user={user} />}


      {/* map */}
      <div className="h-[68%] w-full bg-gray-100 dark:bg-gray-800">
        <LiveTracking pickup={pickup} destination={destination} />
      </div>

      {/* panels container */}
      <div className="h-[32%] w-full flex flex-col justify-end relative">

          {/* find a trip panel and suggests */}
        <div className="bg-white dark:bg-gray-800 w-full py-4 rounded-t-3xl shadow-lg absolute">
        
          <div className="px-6 flex justify-between items-center">
            <h4 className="text-2xl font-semibold text-black dark:text-white">Find a trip</h4>
            <i
              onClick={() => {
                setPanelOpen(false);
                setPickup("");
                setDestination("");
              }}
              ref={panelCloseRef}
              className="ri-arrow-down-wide-fill text-2xl text-gray-500 dark:text-gray-400 cursor-pointer opacity-0 transition-all duration-300 hover:text-gray-700 dark:hover:text-gray-300"
            ></i>
          </div>

          <form onSubmit={submitHandler}>
          {/* vertical line */}
            <div
              ref={lineRef}
              id="line"
              className="line absolute bg-gray-900 dark:bg-gray-100 h-20 w-1 rounded-full z-10"
            ></div>

            {/* pickup input field */}
            <div ref={pickupInputRef} className="px-4">
              <input
                className="bg-gray-100 dark:bg-gray-700 px-12 py-4 text-base rounded-xl w-full mt-5 relative focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
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
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            </div>

            {/* destination input field */}
            <div className="px-4">
            <input
              className="bg-gray-100 dark:bg-gray-700 px-12 py-4 text-base rounded-lg w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              type="text"
              onClick={() => {
                setPanelOpen(true);
                setIsPickupSelected(false);
              }}
              onChange={async (e) => {
                setDestination(e.target.value);
                if (e.target.value.length > 2) {
                  try {
                    const response = await axios.get(
                      `${import.meta.env.VITE_BASE_URL}/maps/get-suggestion`,
                      {
                        params: { input: e.target.value },
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            </div>

            <div className="flex justify-between px-8">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl w-28 mt-5 p-2 text-center font-semibold text-gray-700 dark:text-gray-300">
                Leave Now
              </div>
              <button
                className="w-28 mt-5 p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                onClick={() => {
                  if (pickup && destination) {
                    setVehiclePanelOpen(true);
                    setPanelOpen(false);
                  }
                }}
              >
                Find Trip
              </button>
            </div>
          </form>

           {/* Location search panel*/}
          <div ref={panelOpenRef} className="h-[0dvh] pt-4 hidden w-full bg-white dark:bg-gray-800">
          <LocationSearchPanel
            suggestion={suggestion}
            isPickupSelected={isPickupSelected}
            handleUseMyLocation={handleUseMyLocation}
            setPanelOpen={setPanelOpen}
            setSuggestion={setSuggestion}
          />
        </div>
        
        </div>

        {/* vehicle panel */}
        <div
          ref={vehiclePanelOpenRef}
          className="px-5 w-full absolute bottom-0 translate-y-[100%] bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg z-10"
        >
          <div className="flex justify-between mt-5">
            <h3 className="text-2xl font-semibold text-black dark:text-white">Choose a Vehicle</h3>
            <i
              onClick={() => {
                setPanelOpen(true);
                setVehiclePanelOpen(false);
                setPickup("");
                setDestination("");
              }}
              ref={vehiclePanelCloseRef}
              className="ri-arrow-down-wide-fill text-2xl text-gray-500 dark:text-gray-400 cursor-pointer opacity-0 transition-all duration-300 hover:text-gray-700 dark:hover:text-gray-300"
            ></i>
          </div>

          <Vehicle
            confirmRidePanel={confirmRidePanel}
            vehiclePanelOpen={vehiclePanelOpen}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanelOpen={setVehiclePanelOpen}
          />
        </div>

        {/* confirm your ride panel */}
        <div
          ref={confirmRidePanelRef}
          className="w-full z-10 fixed bottom-0 translate-y-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg"
        >
          <ConfirmRide
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
            setPanelOpen={setPanelOpen}
          />
        </div>

        {/* looking for driver */}
        <div
          ref={vehicleFoundRef}
          className="h-[72.5dvh] xl:h-[62.5dvh] w-full z-10 fixed translate-y-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg"
        >
          <LookingForDriver
            setVehicleFound={setVehicleFound}
            setPanelOpen={setPanelOpen}
          />
        </div>

        {/* waiting for driver */}
        <div
          ref={waitingForDriverRef}
          className="w-full z-10 fixed translate-y-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg"
        >
          <WaitingForDriver />
        </div>

      </div>
    </div>
  );
};

export default Home;

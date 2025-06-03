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
  const navigate = useNavigate();
  
  // rideContext
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);
  const { pickup, setPickup, destination, setDestination, setRide } = useRideContext();

  // useStates
  const [isMenuOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [isPickupSelected, setIsPickupSelected] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  // useRef
  const navbarRef = useRef(null);
  const menuRef = useRef(null);
  const pickupInputRef = useRef(null);
  const lineRef = useRef(null);
  const panelOpenRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelOpenRef = useRef(null);
  const vehiclePanelCloseRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  
  // handle for use my location
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

  // loader
  {isLocating && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
      <Loader message="Getting your location, please wait..." />
    </div>
  )}
  
// sockets functions
  useEffect(() => {
    // Reset any stale state when component mounts
    setPickup('');
    setDestination('');
    setRide(null);
    setVehiclePanelOpen(false);
    setConfirmRidePanel(false);
    setVehicleFound(false);
    setWaitingForDriver(false);
    
    // Hide all panels initially using GSAP
    if (vehiclePanelOpenRef.current) {
      gsap.set(vehiclePanelOpenRef.current, { 
        display: 'none',
        y: '100%',
        opacity: 0 
      });
    }
    if (confirmRidePanelRef.current) {
      gsap.set(confirmRidePanelRef.current, { 
        display: 'none',
        y: '100%',
        opacity: 0 
      });
    }
    if (vehicleFoundRef.current) {
      gsap.set(vehicleFoundRef.current, { 
        display: 'none',
        y: '100%',
        opacity: 0 
      });
    }
    if (waitingForDriverRef.current) {
      gsap.set(waitingForDriverRef.current, { 
        display: 'none',
        y: '100%',
        opacity: 0 
      });
    }
    
    return () => {
      // Clean up when component unmounts
      setPickup('');
      setDestination('');
      setRide(null);
      setVehiclePanelOpen(false);
      setConfirmRidePanel(false);
      setVehicleFound(false);
      setWaitingForDriver(false);
    };
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", { userType: "user", userId: user._id });

    socket.on("ride-confirmed", (ride) => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    });

    socket.on("ride-start", (ride) => {
      setWaitingForDriver(false);
      navigate("/users/riding", {
        state: { ride }
      });
    });

    return () => {
      socket.off("ride-confirmed");
      socket.off("ride-start");
      // Clean up any remaining state
      setVehicleFound(false);
      setWaitingForDriver(false);
      setRide(null);
    };
  }, [user]);

  // fetching cordinaties
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

  // navbar animation
  useGSAP(() => {
    if (navbarRef.current) {
      gsap.to(navbarRef.current, {
        y: panelOpen || confirmRidePanel ? -100 : 0,
        opacity: panelOpen || confirmRidePanel ? 0 : 1,
        duration: 0.5,
        ease: "power2.inOut",
        force3D: true,
      });
    }
  }, [panelOpen, confirmRidePanel]);

  // menu animation
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

  // location search panel animation
  useGSAP(() => {
    if (panelOpenRef.current && panelCloseRef.current) {
      const screenWidth = window.innerWidth;
  
      let targetHeight = "60dvh"; 
      if (screenWidth >= 2560) {
        targetHeight = "28dvh"; 
      } else if (screenWidth >= 1280) {
        targetHeight = "59dvh";
      }
  
      gsap.to(panelOpenRef.current, {
        height: panelOpen ? targetHeight : "0dvh",
        display: panelOpen ? "block" : "hidden",
        duration: 0.5,
        ease: "power2.inOut",
        force3D: true,
        willChange: "height"
      });
  
      gsap.to(panelCloseRef.current, {
        opacity: panelOpen ? 1 : 0,
        duration: 0.2,
        ease: "none",
        delay: panelOpen ? 0.1 : 0,
        force3D: true,
        overwrite: "auto"
      });
    }
  }, [panelOpen]);
  
  //  vehicle panel animation
  useGSAP(() => {
    if (vehiclePanelOpenRef.current && vehiclePanelCloseRef.current) {
      if (vehiclePanelOpen) {
        // Show panel
        gsap.set(vehiclePanelOpenRef.current, { display: 'block' });
        gsap.to(vehiclePanelOpenRef.current, {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          ease: "power2.inOut",
          force3D: true,
          willChange: "transform"
        });
      } else {
        // Hide panel
        gsap.to(vehiclePanelOpenRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          force3D: true,
          willChange: "transform",
          onComplete: () => {
            gsap.set(vehiclePanelOpenRef.current, { display: 'none' });
          }
        });
      }
      
      gsap.to(vehiclePanelCloseRef.current, {
        opacity: vehiclePanelOpen ? 1 : 0,
        duration: 0.5,
      });
    }
  }, [vehiclePanelOpen]);

  // confirm your ride panel animation
  useGSAP(() => {
    if (confirmRidePanelRef.current) {
      if (confirmRidePanel) {
        // Show panel
        gsap.set(confirmRidePanelRef.current, { display: 'block' });
        gsap.to(confirmRidePanelRef.current, {
          y: '0%',
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
          force3D: true,
          willChange: "transform"
        });
      } else {
        // Hide panel
        gsap.to(confirmRidePanelRef.current, {
          y: '100%',
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          force3D: true,
          willChange: "transform",
          onComplete: () => {
            gsap.set(confirmRidePanelRef.current, { display: 'none' });
          }
        });
      }
    }
  }, [confirmRidePanel]);

  // looking for driver panel animation
  useGSAP(() => {
    if (vehicleFoundRef.current) {
      if (vehicleFound) {
        // Show panel
        gsap.set(vehicleFoundRef.current, { display: 'block' });
        gsap.to(vehicleFoundRef.current, {
          y: '0%',
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
          force3D: true,
          willChange: "transform"
        });
      } else {
        // Hide panel
        gsap.to(vehicleFoundRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          force3D: true,
          willChange: "transform",
          onComplete: () => {
            gsap.set(vehicleFoundRef.current, { display: 'none' });
          }
        });
      }
    }
  }, [vehicleFound]);

  // waiting for driver panel animation
  useGSAP(() => {
    if (waitingForDriverRef.current) {
      if (waitingForDriver) {
        // Show panel
        gsap.set(waitingForDriverRef.current, { display: 'block' });
        gsap.to(waitingForDriverRef.current, {
          y: '0%',
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          force3D: true,
          willChange: "transform"
        });
      } else {
        // Hide panel
        gsap.to(waitingForDriverRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          force3D: true,
          willChange: "transform",
          onComplete: () => {
            gsap.set(waitingForDriverRef.current, { display: 'none' });
          }
        });
      }
    }
  }, [waitingForDriver]);

 

  return (
    <div className="h-[100dvh] w-full bg-white dark:bg-gray-900 text-black dark:text-white overflow-clip">
      
      {/* nav bar */}
      <div ref={navbarRef} className="absolute top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 shadow-sm">
        <NavBar userType="user"/>
      </div>

      {/* map */}
      <div className="h-[71%]  xl:h-[76%] 4k:h-[90%] w-full bg-gray-100 dark:bg-gray-800">
        <LiveTracking
          pickup={pickup}
          destination={destination}
          userType="user"
        />
      </div>

      {/* panels container */}
      <div className="h-[29%] xl:h-[24%]  4k:h-[10%] w-full flex flex-col justify-end relative">

          {/* find a trip panel and suggests */}
        <div className="bg-white dark:bg-gray-800 w-full pt-[clamp(1rem,2vw,1.5rem)] rounded-t-3xl shadow-lg absolute">
        
          <div className="px-[clamp(1.25rem,3vw,2rem)] flex justify-between items-center">
            <h4 className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold text-black dark:text-white">Find a trip</h4>
            <i
              onClick={() => {
                setPanelOpen(false);
                setPickup("");
                setDestination("");
              }}
              ref={panelCloseRef}
              className="ri-arrow-down-wide-fill text-[clamp(1.25rem,2vw,1.5rem)] text-gray-500 dark:text-gray-400 cursor-pointer opacity-0 transition-all duration-300 hover:text-gray-700 dark:hover:text-gray-300"
            ></i>
          </div>

          <form onSubmit={submitHandler} className="mt-[clamp(0.5rem,1.5vw,1rem)]">
          {/* vertical line */}
            <div
              ref={lineRef}
              id="line"
              className="line absolute bg-gray-900 dark:bg-gray-100 h-[clamp(2.5rem,4vw,3.5rem)] w-1 rounded-full z-10"
            ></div>

            {/* pickup input field */}
            <div ref={pickupInputRef} className="px-[clamp(1rem,2vw,1.5rem)]">
              <input
                className="bg-gray-100 dark:bg-gray-700 px-[clamp(2.5rem,4vw,3.5rem)] py-[clamp(0.875rem,1.5vw,1.25rem)] text-[clamp(0.875rem,1.25vw,1.125rem)] rounded-xl w-full mt-[clamp(0.75rem,1.5vw,1.25rem)] relative focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm"
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
            <div className="px-[clamp(1rem,2vw,1.5rem)]">
            <input
              className="bg-gray-100 dark:bg-gray-700 px-[clamp(2.5rem,4vw,3.5rem)] py-[clamp(0.875rem,1.5vw,1.25rem)] text-[clamp(0.875rem,1.25vw,1.125rem)] rounded-xl w-full mt-[clamp(0.5rem,1vw,0.75rem)] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm"
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

            <div className="flex justify-between px-[clamp(1.5rem,3vw,2rem)] 4k:px-[clamp(3rem,5vw,4rem)] pb-[clamp(0.75rem,1.5vw,1.25rem)] mt-[clamp(0.75rem,1.5vw,1.25rem)]">
              <button 
                className="w-[clamp(7rem,15vw,12rem)] py-[clamp(0.75rem,1.25vw,1rem)] bg-blue-500 dark:bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg active:shadow-sm text-[clamp(0.875rem,1.25vw,1.125rem)]"
                onClick={() => handleUseMyLocation()}
              >
                Leave Now
              </button>
              <button
                className="w-[clamp(7rem,15vw,12rem)] py-[clamp(0.75rem,1.25vw,1rem)] bg-blue-500 dark:bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg active:shadow-sm text-[clamp(0.875rem,1.25vw,1.125rem)]"
                onClick={() => {
                  if (pickup && destination) {
                    setPanelOpen(false);
                    setVehiclePanelOpen(true);
                  }
                }}
              >
                Find Trip
              </button>
            </div>
          </form>

           {/* Location search panel*/}
           <div
              ref={panelOpenRef}
              className="overflow-hidden transition-all duration-500 ease-in-out hidden w-full bg-white dark:bg-gray-800"
            >
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
          className="px-[clamp(1.25rem,3vw,2rem)] w-full absolute bottom-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg z-10"
        >
          <div className="flex justify-between mt-[clamp(1rem,2vw,1.5rem)]">
            <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold text-black dark:text-white">Choose a Vehicle</h3>
            <i
              onClick={() => {
                setPanelOpen(true);
                setVehiclePanelOpen(false);
                setPickup("");
                setDestination("");
              }}
              ref={vehiclePanelCloseRef}
              className="ri-arrow-down-wide-fill text-[clamp(1.25rem,2vw,1.5rem)] text-gray-500 dark:text-gray-400 cursor-pointer opacity-0 transition-all duration-300 hover:text-gray-700 dark:hover:text-gray-300"
            ></i>
          </div>

          <Vehicle
            vehiclePanelOpen={vehiclePanelOpen}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanelOpen={setVehiclePanelOpen}
          />
        </div>

        {/* confirm your ride panel */}
        <div
          ref={confirmRidePanelRef}
          className="w-full z-10 fixed bottom-0 rounded-t-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg"
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
          className="h-[75dvh] xl:h-[64dvh] 4k:h-[30%] w-full rounded-t-3xl overflow-hidden z-10 fixed bg-white dark:bg-gray-800 shadow-lg"
        >
          <LookingForDriver
            setVehicleFound={setVehicleFound}
            setConfirmRidePanel={setConfirmRidePanel}
          />
        </div>

        {/* waiting for driver */}
        <div
          ref={waitingForDriverRef}
          className="w-full z-10 fixed rounded-t-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg"
        >
          <WaitingForDriver />
        </div>

      </div>
    </div>
  );
};

export default Home;

import { useState, useRef, useContext, useEffect } from "react";
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

// Contexts
import { SocketContext } from "../context/socketContext";
import { UserDataContext } from "../context/UserContext";
import { useRideContext } from "../context/rideContext";

const Home = () => {
  const { pickup, setPickup, destination, setDestination, setRide } =
    useRideContext();
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
  const vehicleFoundRef = useRef(null);
  const [vehicleFound, setVehicleFound] = useState(false);
  const waitingForDriverRef = useRef(null);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);
  const [userLocation, setUserLocation] = useState(null);

  const handleUseMyLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const userCoordinates = `${coords.latitude}, ${coords.longitude}`;
          setUserLocation(userCoordinates);

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
            setPickup(response.data.address);
          } catch (error) {
            console.error("Error reverse geocoding:", error);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  };

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

    // Clean up listeners
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

  useGSAP(() => {
    gsap.to(panelOpenRef.current, {
      height: panelOpen ? "70%" : "0%",
      duration: 0.5,
    });
    gsap.to(panelCloseRef.current, {
      opacity: panelOpen ? 1 : 0,
      duration: 0.5,
    });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelOpenRef.current, {
      transform: vehiclePanelOpen ? "translateY(0%)" : "translateY(100%)",
      duration: 0.5,
    });
    gsap.to(vehiclePanelCloseRef.current, {
      opacity: vehiclePanelOpen ? 1 : 0,
      duration: 0.5,
    });
  }, [vehiclePanelOpen]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      transform: confirmRidePanel ? "translateY(0%)" : "translateY(100%)",
      duration: 0.5,
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? "translateY(0%)" : "translateY(100%)",
      duration: 0.5,
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      y: waitingForDriver ? 0 : "100%",
      duration: 0.5,
      ease: waitingForDriver ? "power2.out" : "power2.in",
    });
  }, [waitingForDriver]);

  return (
    <div className="h-screen relative overflow-hidden">
      <p className="fixed p-2 text-xl font-semibold z-10">Kuber</p>

      <div className="h-[70%] w-full">
        <LiveTracking userLocation={userLocation} />
      </div>

      <div className="h-screen w-full flex flex-col justify-end absolute top-0">
        <div className="h-[30%] bg-white relative w-full p-5">
          <div className="flex justify-between">
            <h4 className="text-2xl font-semibold">Find a trip</h4>
            <i
              onClick={() => {
                setPanelOpen(false);
                setPickup("");
                setDestination("");
              }}
              ref={panelCloseRef}
              className="ri-arrow-down-wide-fill text-2xl opacity-0"
            ></i>
          </div>

          <form onSubmit={submitHandler}>
            <div className="line absolute bg-gray-900 h-16 w-1 top-[30%] left-10 rounded-full"></div>

            <input
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-5"
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

            <input
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3"
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

            <div className="flex justify-between px-4">
              <div className="bg-[#eee] rounded-3xl w-28 mt-5 p-2">
                <p className="text-center font-semibold">leave now</p>
              </div>
              <button
                className="w-28 mt-5 p-2 bg-[#eee] rounded-full font-semibold"
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
        </div>

        <div ref={panelOpenRef} className="h-[0%] w-full bg-white">
          <LocationSearchPanel
            suggestion={suggestion}
            isPickupSelected={isPickupSelected}
            handleUseMyLocation={handleUseMyLocation}
            setPanelOpen={setPanelOpen}
            setSuggestion={setSuggestion}
          />
        </div>

        <div
          ref={vehiclePanelOpenRef}
          className="px-5 w-full absolute bottom-0 translate-y-[100%] bg-white"
        >
          <div className="flex justify-between mt-5">
            <h3 className="text-2xl font-semibold">Choose a Vehicle</h3>
            <i
              onClick={() => {
                setPanelOpen(true);
                setVehiclePanelOpen(false);
                setPickup("");
                setDestination("");
              }}
              ref={vehiclePanelCloseRef}
              className="ri-arrow-down-wide-fill text-2xl opacity-0"
            ></i>
          </div>

          <Vehicle
            confirmRidePanel={confirmRidePanel}
            vehiclePanelOpen={vehiclePanelOpen}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanelOpen={setVehiclePanelOpen}
          />
        </div>

        <div
          ref={confirmRidePanelRef}
          className="h-[70%] fixed w-full z-10 bottom-0 translate-y-full bg-white"
        >
          <ConfirmRide
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
            setPanelOpen={setPanelOpen}
          />
        </div>

        <div
          ref={vehicleFoundRef}
          className="h-[60%] fixed w-full z-10 bottom-0 translate-y-full bg-white"
        >
          <LookingForDriver
            setVehicleFound={setVehicleFound}
            setPanelOpen={setPanelOpen}
          />
        </div>

        <div
          ref={waitingForDriverRef}
          className="h-[60%] fixed w-full z-10 bottom-0 translate-y-full bg-white"
        >
          <WaitingForDriver />
        </div>
      </div>
    </div>
  );
};

export default Home;

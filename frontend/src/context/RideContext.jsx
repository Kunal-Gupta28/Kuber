import { createContext, useContext, useState, useEffect } from "react";

// Create the context
export const RideContext = createContext();

// Helper to split address
const splitAddress = (address) => {
  if (!address) return ["Unknown", ""];
  const parts = address.split(", ");
  return [parts[0], parts.slice(1).join(", ")];
};

export const RideContextProvider = ({ children }) => {

  const [ isUserTypeIsCaptain, setIsUserTypeIsCaptain] = useState(false)

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [ride, setRide] = useState(null);
  const [fare, setFare] = useState('')
  const [vehicleInfo, setVehicleInfo] = useState();  

  // pickup and destination in mian and details forms
  const [pickupMain, setPickupMain] = useState("");
  const [pickupDetails, setPickupDetails] = useState("");
  const [destinationMain, setDestinationMain] = useState("");
  const [destinationDetails, setDestinationDetails] = useState("");

  // distance and duration
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  
  
  useEffect(() => {
    const [main, details] = splitAddress(pickup);
    setPickupMain(main);
    setPickupDetails(details);
  }, [pickup]);

  useEffect(() => {
    const [main, details] = splitAddress(destination);
    setDestinationMain(main);
    setDestinationDetails(details);
  }, [destination]);

    // When ride updates, update fare
    useEffect(() => {
      if (isUserTypeIsCaptain) {
        setPickup(ride?.pickup || "");   
        setDestination(ride?.destination || ""); 
        setDistance(ride?.distance || "");
        setDuration(ride?.duration || "");
        setFare(ride?.fare || "");
      } else {
        setFare(vehicleInfo?.fare || "");
      }
    }, [vehicleInfo, ride, isUserTypeIsCaptain]);




  return (
    <RideContext.Provider
      value={{
        setIsUserTypeIsCaptain,
        ride,
        setRide,
        pickup,
        setPickup,
        destination,
        setDestination,
        pickupMain,
        pickupDetails,
        destinationMain,
        destinationDetails,
        vehicleInfo,
        setVehicleInfo,
        fare,
        setFare,
        distance, 
        setDistance,
        duration,
        setDuration,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

// Custom hook to consume ride context
export const useRideContext = () => useContext(RideContext);

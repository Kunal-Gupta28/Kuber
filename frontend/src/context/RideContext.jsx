// src/context/rideContext.js
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
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [confirmRideDetails, setConfirmRideDetails] = useState();
  const fare = confirmRideDetails?.fare;
  
  const [pickupMain, setPickupMain] = useState("");
  const [pickupDetails, setPickupDetails] = useState("");
  const [destinationMain, setDestinationMain] = useState("");
  const [destinationDetails, setDestinationDetails] = useState("");

  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  
  const [ride, setRide] = useState(null);
  
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

  return (
    <RideContext.Provider
      value={{
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
        confirmRideDetails,
        setConfirmRideDetails,
        fare,
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

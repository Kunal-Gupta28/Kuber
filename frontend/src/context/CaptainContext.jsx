import { createContext, useState, useContext, useEffect } from "react";

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [ride, setRide] = useState(null);
  const [fare, setFare] = useState(null); // Init separately
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // When ride updates, update fare
  useEffect(() => {
    if (ride?.fare) {
      setFare(ride.fare);
    }
  }, [ride]);

  const splitAddress = (address) => {
    if (!address) return ["Unknown", ""];
    const parts = address.split(", ");
    return [parts[0], parts.slice(1).join(", ")];
  };

  const [pickupMain, pickupDetails] = splitAddress(ride?.pickup);
  const [destinationMain, destinationDetails] = splitAddress(ride?.destination);

  return (
    <CaptainDataContext.Provider
      value={{
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        ride,
        setRide,
        fare,
        setFare,
        pickupMain,
        pickupDetails,
        destinationMain,
        destinationDetails,
      }}
    >
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;

export const useCaptainContext = () => useContext(CaptainDataContext);

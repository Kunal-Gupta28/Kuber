import React, { createContext, useContext, useState } from "react";

// Create Context
const CaptainDataContext = createContext(null);

// Custom Hook for Context Access
export const useCaptain = () => {
  const context = useContext(CaptainDataContext);
  if (!context) {
    throw new Error("useCaptain must be used within a CaptainProvider");
  }
  return context;
};

// Context Provider Component
const CaptainProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCaptain = (captainData) => setCaptain(captainData);

  return (
    <CaptainDataContext.Provider
      value={{ captain, setCaptain, isLoading, setIsLoading, error, setError, updateCaptain }}
    >
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainProvider;
export { CaptainDataContext };

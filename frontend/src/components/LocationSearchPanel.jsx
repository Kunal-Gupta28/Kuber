import React, { useEffect, useState } from "react";
import { useRideContext } from "../context/RideContext";

const LocationSearchPanel = ({
  suggestion = [],
  isPickupSelected,
  handleUseMyLocation,
  setPanelOpen,
  setSuggestion,
}) => {
  const {setPickup,setDestination} = useRideContext()
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSelect = (value) => {
    // Set pickup or destination
    if (isPickupSelected) {
      setPickup(value);
    } else {
      setDestination(value);
    }

    // Update recent searches
    const updated = [value, ...recentSearches.filter((item) => item !== value)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Close the panel and clear suggestions
    setSuggestion([]);
  };

  return (
    <div>
      {/* Use My Current Location */}
      {isPickupSelected && (
        <div className="mx-5 my-3">
          <button
            onClick={() => {
              handleUseMyLocation();
              setSuggestion([]);
            }}
            className="w-full text-sm bg-black active:bg-gray-800 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            Use My Current Location
          </button>
        </div>
      )}

      {/* Suggestions */}
      {suggestion.length > 0 && (
        <>
          <h3 className="text-gray-600 text-sm px-5 mt-3">Suggestions</h3>
          {suggestion.map((element, index) => (
            <div
              key={index}
              onClick={() => handleSelect(element.label || element)}
              role="button"
              tabIndex="0"
              className="mx-5 flex gap-4 my-4 p-3 border-gray-50 rounded-xl items-center justify-start border-2 cursor-pointer 
                      transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-gray-300 active:scale-95"
            >
              <h2 className="bg-[#eee] h-10 flex justify-center items-center w-12 rounded-full">
                <i className="ri-map-pin-line"></i>
              </h2>
              <h4 className="font-medium">{element.label || element}</h4>
            </div>
          ))}
        </>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && suggestion.length === 0 && (
        <>
          <h3 className="text-gray-600 text-sm px-5 mt-5">Recent Searches</h3>
          {recentSearches.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              role="button"
              tabIndex="0"
              className="mx-5 flex gap-4 my-4 p-3 border-gray-50 rounded-xl items-center justify-start border-2 cursor-pointer 
                      transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-gray-300 active:scale-95"
            >
              <h2 className="bg-[#f5f5f5] h-10 flex justify-center items-center w-12 rounded-full">
                <i className="ri-history-line"></i>
              </h2>
              <h4 className="font-medium">{item}</h4>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default LocationSearchPanel;

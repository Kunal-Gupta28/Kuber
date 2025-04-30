import { useEffect, useState } from "react";
import { useRideContext } from "../context/RideContext";
import Loader from "./Loader";

const LocationSearchPanel = ({
  suggestion = [],
  isPickupSelected,
  handleUseMyLocation,
  setPanelOpen,
  setSuggestion,
}) => {
  const {setPickup,setDestination} = useRideContext()
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLocating, setIsLocating] = useState(false);

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

  const handleUseMyLocationClick = async () => {
    try {
      setIsLocating(true);
      await handleUseMyLocation();
      setSuggestion([]);
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* Use My Current Location */}
      {isPickupSelected && (
        <div className="mx-5 py-6">
          <button
            onClick={handleUseMyLocationClick}
            disabled={isLocating}
            className={`w-full text-sm ${
              isLocating 
                ? "bg-gray-400 dark:bg-gray-600" 
                : "bg-black dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700"
            } text-white font-semibold py-2 px-4 rounded-xl transition-colors`}
          >
            {isLocating ? "Getting Location..." : "Use My Current Location"}
          </button>
        </div>
      )}

      {isLocating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Loader/>
        </div>
      )}

      {/* Suggestions */}
      {suggestion.length > 0 && (
  <div className="mt-4 pb-1">
    <h3 className="text-gray-600 dark:text-gray-400 text-sm px-5 pt-3">Suggestions</h3>
    {suggestion.map((element, index) => (
      <div
        key={index}
        onClick={() => handleSelect(element.label || element)}
        role="button"
        tabIndex="0"
        className="mx-5 flex gap-4 my-4 p-3 border-gray-50 dark:border-gray-700 rounded-xl items-center justify-start border-2 cursor-pointer 
                transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 active:scale-95"
      >
        <h2 className="bg-[#eee] dark:bg-gray-700 h-10 flex justify-center items-center w-12 rounded-full">
          <i className="ri-map-pin-line"></i>
        </h2>
        <h4 className="font-medium">{element.label || element}</h4>
      </div>
    ))}
  </div>
)}


    {/* Recent Searches */}
{recentSearches.length > 0 && suggestion.length === 0 && (
  <div className="mt-4 pb-1">
    <h3 className="text-gray-600 dark:text-gray-400 text-sm px-5 pt-5">Recent Searches</h3>
    {recentSearches.map((item, index) => (
      <div
        key={index}
        onClick={() => handleSelect(item)}
        role="button"
        tabIndex="0"
        className="mx-5 flex gap-4 my-4 p-3 border-gray-50 dark:border-gray-700 rounded-xl items-center justify-start border-2 cursor-pointer 
                transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 active:scale-95"
      >
        <h2 className="bg-[#f5f5f5] dark:bg-gray-700 h-10 flex justify-center items-center w-12 rounded-full">
          <i className="ri-history-line"></i>
        </h2>
        <h4 className="font-medium">{item}</h4>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default LocationSearchPanel;

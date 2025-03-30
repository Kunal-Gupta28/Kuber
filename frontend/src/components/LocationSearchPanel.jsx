import React from "react";

const LocationSearchPanel = ({ suggestion = [], isPickupSelected,setPickup,setDestination }) => {

  return (
    <div>
      {suggestion.length > 0 ? (
        suggestion.map((element, index) => (
          <div
            key={index}
            onClick={() => (isPickupSelected)?setPickup(element):setDestination(element)}
            role="button"
            tabIndex="0"
            className="mx-5 flex gap-4 my-4 p-3 border-gray-50 rounded-xl items-center justify-start border-2 cursor-pointer 
                    transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-gray-300 active:scale-95"
          >
            <h2 className="bg-[#eee] h-10 flex justify-center items-center w-12 rounded-full">
              <i className="ri-map-pin-line"></i>
            </h2>
            <h4 className="font-medium">{element}</h4>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No locations found.</p>
      )}
    </div>
  );
};

export default LocationSearchPanel;

import axios from "axios";
import { useState, useEffect } from "react";
import { useRideContext } from "../context/RideContext";

const Vehicle = ({
  vehiclePanelOpen,
  setConfirmRidePanel,
  setVehiclePanelOpen,
}) => {
  const [fares, setFares] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { pickup, destination, setConfirmRideDetails } = useRideContext();

  const vehicleOptions = [
    {
      image: "/images/UberSelect-White.webp",
      vehicleType: "KUberGo",
      capacity: 4,
      minsAway: 2,
      description: "Affordable, compact rides",
    },
    {
      image: "/images/UberMoto.webp",
      vehicleType: "MOTO",
      capacity: 1,
      minsAway: 3,
      description: "Affordable, motorcycle rides",
    },
    {
      image: "/images/UberComfort-Premium.webp",
      vehicleType: "Premier",
      capacity: 4,
      minsAway: 2,
      description: "Comfortable sedans, top-quality drivers",
    },
    {
      image: "/images/UberAuto.webp",
      vehicleType: "KUberAuto",
      capacity: 3,
      minsAway: 5,
      description: "Affordable, auto rides",
    },
  ];

  useEffect(() => {
    const fetchFares = async () => {
      if (!pickup || !destination) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
          {
            params: { pickup, destination },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const fareObj = {};
        response.data.forEach(({ vehicleType, fare }) => {
          fareObj[vehicleType] = fare;
        });
        setFares(fareObj);
      } catch (error) {
        console.error("Error fetching fares:", error);
      }
    };

    fetchFares();
  }, [pickup, destination, vehiclePanelOpen]);

  return (
    <div className="h-[50vh] w-full bg-white dark:bg-gray-900 text-black dark:text-white overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {vehicleOptions.map((vehicle) => {
          const isSelected = selectedVehicle === vehicle.vehicleType;
          const fare = fares[vehicle.vehicleType] ?? "--";

          return (
            <div
              key={vehicle.vehicleType}
              onClick={() => {
                setConfirmRideDetails({
                  ...vehicle,
                  fare,
                });
                setSelectedVehicle(vehicle.vehicleType);
                setVehiclePanelOpen(false);
                setConfirmRidePanel(true);
              }}
              className={`
                relative flex flex-col md:flex-row items-center p-6 rounded-2xl cursor-pointer
                transition-all duration-300 ease-in-out
                ${isSelected 
                  ? "bg-blue-50 dark:bg-blue-900/20 shadow-lg border-2 border-blue-500 dark:border-blue-400" 
                  : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700"
                }
              `}
            >
              {/* Vehicle Image */}
              <div className="w-full md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <img
                  className="w-28 h-28 object-contain"
                  src={vehicle.image}
                  alt={vehicle.vehicleType}
                />
              </div>

              {/* Vehicle Details */}
              <div className="w-full md:w-1/2 px-4">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="font-bold text-xl">{vehicle.vehicleType}</h4>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    <i className="ri-user-fill text-base"></i>
                    <span className="ml-1 text-sm">{vehicle.capacity}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  <i className="ri-time-line mr-1"></i>
                  {vehicle.minsAway} mins away
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {vehicle.description}
                </p>
              </div>

              {/* Fare */}
              <div className="w-full md:w-1/6 text-right mt-4 md:mt-0">
                <p className="font-bold text-xl text-blue-600 dark:text-blue-400">
                  ₹{fare}
                </p>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 text-blue-500 dark:text-blue-400">
                  <i className="ri-checkbox-circle-fill text-2xl"></i>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Vehicle;

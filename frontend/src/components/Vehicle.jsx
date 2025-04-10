import axios from "axios";
import { useState, useEffect } from "react";

const Vehicle = ({
  pickup,
  destination,
  vehiclePanelOpen,
  setConfirmRidePanel,
  setConfirmRideDetails,
  setVehiclePanelOpen
}) => {
  const [fares, setFares] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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

        // Transform array to object for quick access
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
    <div className="h-[50vh] w-full">
      {vehicleOptions.map((vehicle) => {
        const isSelected = selectedVehicle === vehicle.vehicleType;

        return (
          <div
            key={vehicle.vehicleType}
            onClick={() => {
              setConfirmRideDetails({
                ...vehicle,
                fare: fares[vehicle.vehicleType] || "--",
              });
              setSelectedVehicle(vehicle.vehicleType);
              setVehiclePanelOpen(false);
              setConfirmRidePanel(true);
            }}
            className={`h-[20%] flex justify-between items-center my-5 border-2 p-2 rounded-xl cursor-pointer transition duration-200 ${
              isSelected ? "border-black bg-gray-100 shadow-sm" : "border-white"
            }`}
          >
            <div className="w-[25%]">
              <img
                className="w-full h-auto object-contain"
                src={vehicle.image}
                alt={vehicle.vehicleType}
              />
            </div>
            <div className="w-[50%]">
              <h4 className="font-bold text-xl flex items-center gap-1">
                {vehicle.vehicleType}
                <i className="ri-user-fill text-base font-thin">
                  <span className="font-medium ml-1">{vehicle.capacity}</span>
                </i>
              </h4>
              <h5 className="font-medium">{vehicle.minsAway} mins away</h5>
              <p className="text-gray-500 text-xs">{vehicle.description}</p>
            </div>
            <div className="w-[20%] text-right">
              <p className="font-semibold text-xl">
                ₹{fares[vehicle.vehicleType] ?? "--"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Vehicle;

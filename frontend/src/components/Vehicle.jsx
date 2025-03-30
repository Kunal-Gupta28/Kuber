import axios from "axios";
import { useState, useEffect } from "react";

const Vehicle = ({
  pickup,
  destination,
  vehiclePanelOpen,
  setConfirmRidePanel,
  setConfirmRideDetails,
}) => {
  const [fares, setFares] = useState({});

  const vehicleOptions = [
    {
      image: "/src/assets/images/UberSelect-White.webp",
      vehicleType: "KUberGo",
      capacity: 4,
      minsAway: 2,
      description: "Affordable, compact rides",
    },
    {
      image: "/src/assets/images/Uber_Moto_Orange_312x208_pixels_Mobile.webp",
      vehicleType: "MOTO",
      capacity: 1,
      minsAway: 3,
      description: "Affordable, motorcycle rides",
    },
    {
      image: "/src/assets/images/UberComfort-Premium.webp",
      vehicleType: "Premier",
      capacity: 4,
      minsAway: 2,
      description: "Comfortable sedans, top-quality drivers",
    },
    {
      image: "/src/assets/images/Uber_Auto_558x372_pixels_Desktop.webp",
      vehicleType: "KUberAuto",
      capacity: 3,
      minsAway: 5,
      description: "Affordable, auto rides",
    },
  ];

  // Fetch fares for all vehicle types in a single request
  useEffect(() => {
    const fetchFares = async () => {
      if (!pickup || !destination) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/get-fares`, // Updated endpoint
          {
            params: { pickup, destination },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Assuming API returns an array of fares [{ vehicleType: "KUberGo", fare: 200 }, ...]
        const newFares = response.data.reduce((acc, { vehicleType, fare }) => {
          acc[vehicleType] = typeof fare === "number" ? `₹${fare.toFixed(2)}` : "N/A";
          return acc;
        }, {});

        setFares(newFares);
      } catch (error) {
        console.error("Error fetching fares:", error);
      }
    };

    fetchFares();
  }, [vehiclePanelOpen]);

  return (
    <div className="h-[50vh] w-full">
      {vehicleOptions.map((element) => (
        <div
          key={element.vehicleType}
          onClick={() => {
            setConfirmRideDetails(element);
            setConfirmRidePanel(true);
          }}
          className="h-[21%] flex justify-between my-5 border-2 p-2 active:border-black border-white rounded-xl cursor-pointer"
        >
          <div className="w-[25%]">
            <img
              className="w-full"
              src={element.image}
              alt={element.vehicleType}
            />
          </div>
          <div className="w-[50%]">
            <h4 className="font-bold text-xl">
              {element.vehicleType} {" "}
              <i className="ri-user-fill font-thin text-base">
                <span className="font-medium">{element.capacity}</span>
              </i>
            </h4>
            <h5 className="font-medium">{element.minsAway} mins away</h5>
            <p className="text-gray-500 text-medium text-xs">
              {element.description}
            </p>
          </div>
          <div className="w-[20%]">
            <p className="font-semibold text-xl">
              {fares[element.vehicleType] || "Loading..."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Vehicle;

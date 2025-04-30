import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";

import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
} from "@react-google-maps/api";
import "remixicon/fonts/remixicon.css";

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
};

const libraries = ["marker", "places"];

const MyMap = (props) => {
  const { pickup: pickup_1, destination: destination_1, coordinates } = props;

  const pickup_2 = coordinates?.pickup
    ? { lat: coordinates.pickup.latitude, lng: coordinates.pickup.longitude }
    : null;

  const destination_2 = coordinates?.destination
    ? {
        lat: coordinates.destination.latitude,
        lng: coordinates.destination.longitude,
      }
    : null;

  const pickup = pickup_1 || pickup_2;
  const destination = destination_1 || destination_2;



  const [currentPosition, setCurrentPosition] = useState(null);
  const [routePath, setRoutePath] = useState(null);

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries,
    mapIds: [import.meta.env.VITE_MAP_ID],
  });

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const userLoc = { lat: coords.latitude, lng: coords.longitude };
          setCurrentPosition(userLoc);
        },
        (error) => console.error("Geolocation error:", error));
    }
  }, []);

  // Fetch directions and set route path
  useEffect(() => {
    if (
      isLoaded &&
      pickup &&
      destination &&
      window.google?.maps?.DirectionsService
    ) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: pickup,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setRoutePath(result.routes[0].overview_path);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }
  }, [pickup, destination, isLoaded]);

  // Map load handler
  const handleMapLoad = (map) => {
    mapRef.current = map;

    if (!window.google?.maps?.marker || !currentPosition) return;

    const { AdvancedMarkerElement } = window.google.maps.marker;

    const markerEl = document.createElement("div");
    markerEl.innerHTML = `<i class="ri-map-pin-user-fill"></i>`;

    Object.assign(markerEl.style, {
      fontSize: "36px",
      color: "black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });

    markerRef.current = new AdvancedMarkerElement({
      map,
      position: currentPosition,
      content: markerEl,
      title: "You are here!",
    });
  };

  // Center map on current location
  const recenterMap = () => {
    if (mapRef.current && currentPosition) {
      mapRef.current.setCenter(currentPosition);
      mapRef.current.setZoom(15);
    }
  };

  if (!isLoaded) return <div className="h-full w-full flex justify-center items-center"><Loader message="Loading Map API... "/></div>;
  if (!currentPosition) return <div className="h-full w-full flex justify-center items-center"><Loader message="Getting your location... "/></div>;

  return (
    <div style={containerStyle}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={currentPosition}
        zoom={15}
        onLoad={handleMapLoad}
        options={{
          mapId: import.meta.env.VITE_MAP_ID,
          disableDefaultUI: true,
        }}
      >
        {routePath && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: "#000000",
              strokeOpacity: 1.0,
              strokeWeight: 5,
            }}
          />
        )}
      </GoogleMap>

      <button
  onClick={recenterMap}
  className="h-[50px] w-[50px] absolute bottom-[60px] xl:bottom-[80px] xl:right-[40px] right-[20px] bg-white border-none rounded-full p-3 shadow-md cursor-pointer"
>
  <i className="ri-focus-3-line text-[20px] text-black"></i>
</button>

    </div>
  );
};

export default MyMap;

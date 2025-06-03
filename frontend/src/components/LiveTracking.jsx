import React, { useEffect, useRef, useState } from "react";
import { MapLoader } from "./Loader";

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
  const { pickup: pickup_1, destination: destination_1, coordinates, userType } = props;

  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routePath, setRoutePath] = useState(null);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries,
    mapIds: [import.meta.env.VITE_MAP_ID],
  });

  // Convert address to coordinates
  useEffect(() => {
    const geocodeAddress = async (address) => {
      if (!address || !window.google?.maps?.Geocoder) return null;
      
      const geocoder = new window.google.maps.Geocoder();
      try {
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0].geometry.location);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });
        return { lat: result.lat(), lng: result.lng() };
      } catch (error) {
        console.error('Geocoding error:', error);
        return null;
      }
    };

    const updateCoordinates = async () => {
      // Handle pickup coordinates
      if (pickup_1 && typeof pickup_1 === 'string') {
        const coords = await geocodeAddress(pickup_1);
        if (coords) setPickupCoords(coords);
      } else if (coordinates?.pickup) {
        setPickupCoords({
          lat: coordinates.pickup.latitude,
          lng: coordinates.pickup.longitude
        });
      }

      // Handle destination coordinates
      if (destination_1 && typeof destination_1 === 'string') {
        const coords = await geocodeAddress(destination_1);
        if (coords) setDestinationCoords(coords);
      } else if (coordinates?.destination) {
        setDestinationCoords({
          lat: coordinates.destination.latitude,
          lng: coordinates.destination.longitude
        });
      }
    };

    if (isLoaded) {
      updateCoordinates();
    }
  }, [pickup_1, destination_1, coordinates, isLoaded]);

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
      pickupCoords &&
      destinationCoords &&
      window.google?.maps?.DirectionsService
    ) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: pickupCoords,
          destination: destinationCoords,
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
  }, [pickupCoords, destinationCoords, isLoaded]);

  // Map load handler
  const handleMapLoad = (map) => {
    mapRef.current = map;

    if (!window.google?.maps?.marker) return;

    const { AdvancedMarkerElement } = window.google.maps.marker;

    // Create user/captain marker
    if (currentPosition) {
      const userMarkerEl = document.createElement("div");
      userMarkerEl.innerHTML = userType === "captain" 
        ? `<i class="ri-car-fill"></i>`
        : `<i class="ri-map-pin-user-fill"></i>`;

      Object.assign(userMarkerEl.style, {
        fontSize: "36px",
        color: "#000000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      });

      markerRef.current = new AdvancedMarkerElement({
        map,
        position: currentPosition,
        content: userMarkerEl,
        title: userType === "captain" ? "You (Captain)" : "You are here!",
      });
    }

    // Create pickup marker
    if (pickupCoords) {
      const pickupMarkerEl = document.createElement("div");
      pickupMarkerEl.innerHTML = `<i class="ri-map-pin-fill"></i>`;

      Object.assign(pickupMarkerEl.style, {
        fontSize: "36px",
        color: "#000000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      });

      pickupMarkerRef.current = new AdvancedMarkerElement({
        map,
        position: pickupCoords,
        content: pickupMarkerEl,
        title: "Pickup Location",
      });
    }

    // Create destination marker
    if (destinationCoords) {
      const destMarkerEl = document.createElement("div");
      destMarkerEl.innerHTML = `<i class="ri-flag-fill"></i>`;

      Object.assign(destMarkerEl.style, {
        fontSize: "36px",
        color: "#000000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      });

      destinationMarkerRef.current = new AdvancedMarkerElement({
        map,
        position: destinationCoords,
        content: destMarkerEl,
        title: "Destination",
      });
    }
  };

  // Center map on current location
  const recenterMap = () => {
    if (mapRef.current && currentPosition) {
      mapRef.current.setCenter(currentPosition);
      mapRef.current.setZoom(15);
    }
  };

  // Update markers when position or destination changes
  useEffect(() => {
    if (!mapRef.current || !window.google?.maps?.marker) return;

    const { AdvancedMarkerElement } = window.google.maps.marker;

    // Update user/captain marker
    if (currentPosition) {
      if (!markerRef.current) {
        const userMarkerEl = document.createElement("div");
        userMarkerEl.innerHTML = userType === "captain" 
          ? `<i class="ri-car-fill"></i>`
          : `<i class="ri-map-pin-user-fill"></i>`;
        Object.assign(userMarkerEl.style, {
          fontSize: "36px",
          color: "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        });
        markerRef.current = new AdvancedMarkerElement({
          map: mapRef.current,
          position: currentPosition,
          content: userMarkerEl,
          title: userType === "captain" ? "You (Captain)" : "You are here!",
        });
      } else {
        markerRef.current.position = currentPosition;
      }
    }

    // Update pickup marker
    if (pickupCoords) {
      if (!pickupMarkerRef.current) {
        const pickupMarkerEl = document.createElement("div");
        pickupMarkerEl.innerHTML = `<i class="ri-map-pin-fill"></i>`;
        Object.assign(pickupMarkerEl.style, {
          fontSize: "36px",
          color: "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        });
        pickupMarkerRef.current = new AdvancedMarkerElement({
          map: mapRef.current,
          position: pickupCoords,
          content: pickupMarkerEl,
          title: "Pickup Location",
        });
      } else {
        pickupMarkerRef.current.position = pickupCoords;
      }
    }

    // Update destination marker
    if (destinationCoords) {
      if (!destinationMarkerRef.current) {
        const destMarkerEl = document.createElement("div");
        destMarkerEl.innerHTML = `<i class="ri-flag-fill"></i>`;
        Object.assign(destMarkerEl.style, {
          fontSize: "36px",
          color: "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        });
        destinationMarkerRef.current = new AdvancedMarkerElement({
          map: mapRef.current,
          position: destinationCoords,
          content: destMarkerEl,
          title: "Destination",
        });
      } else {
        destinationMarkerRef.current.position = destinationCoords;
      }
    }
  }, [currentPosition, pickupCoords, destinationCoords, userType]);

  if (!isLoaded) return <div className="h-full w-full relative"><MapLoader message="Loading Map API... "/></div>;
  if (!currentPosition) return <div className="h-full w-full relative"><MapLoader message="Getting your location... "/></div>;

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

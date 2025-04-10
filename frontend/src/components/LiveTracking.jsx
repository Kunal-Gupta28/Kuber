import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import "remixicon/fonts/remixicon.css";

// Container style for map wrapper
const containerStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
};

// Load Google Maps libraries (in this case, just marker for custom marker support)
const libraries = ["marker"];

const MyMap = ({ coordinates,userLocation }) => {
  // Convert backend coordinates to proper lat/lng objects
  const pickup = coordinates?.pickup
    ? { lat: coordinates.pickup.latitude, lng: coordinates.pickup.longitude }
    : null;

  const destination = coordinates?.destination
    ? {
        lat: coordinates.destination.latitude,
        lng: coordinates.destination.longitude,
      }
    : null;

  // State to store user's current location
  const [currentPosition, setCurrentPosition] = useState(null);

  // State to store calculated route directions
  const [directions, setDirections] = useState(null);

  // Refs for map and custom marker
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Load Google Maps JS API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries,
    mapIds: [import.meta.env.VITE_MAP_ID], // for custom map styling
  });

  // Get and set user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const userLocation = { lat: coords.latitude, lng: coords.longitude };
          setCurrentPosition(userLocation);
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Generate directions when pickup and destination are available
  useEffect(() => {
    if (
      pickup?.lat &&
      pickup?.lng &&
      destination?.lat &&
      destination?.lng &&
      window.google
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
            setDirections(result);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }
  }, [pickup, destination]);

  // Called when map is loaded
  const handleMapLoad = (map) => {
    mapRef.current = map;

    // Check if marker library is available and user location is set
    if (!window.google?.maps?.marker || !currentPosition) return;

    const { AdvancedMarkerElement } = window.google.maps.marker;

    // Custom marker with an icon
    const markerEl = document.createElement("div");
    markerEl.innerHTML = `<i class="ri-map-pin-user-fill"></i>`;

    Object.assign(markerEl.style, {
      fontSize: "36px",
      color: "black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });

    // Place custom marker at user's location
    markerRef.current = new AdvancedMarkerElement({
      map,
      position: currentPosition,
      content: markerEl,
      title: "You are here!",
    });
  };

  // Recenter map to user’s location
  const recenterMap = () => {
    if (mapRef.current && currentPosition) {
      mapRef.current.setCenter(currentPosition);
      mapRef.current.setZoom(15);
    }
  };

  // Loading states
  if (!isLoaded) return <div>Loading Map API...</div>;
  if (!currentPosition) return <div>Getting your location...</div>;

  return (
    <div style={containerStyle}>
      {/* Map component */}
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
        {/* Show route if available */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Recenter button */}
      <button
        onClick={recenterMap}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          backgroundColor: "white",
          border: "none",
          borderRadius: "50%",
          padding: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          cursor: "pointer",
        }}
      >
        <i
          className="ri-focus-3-line"
          style={{ fontSize: "20px", color: "black" }}
        ></i>
      </button>
    </div>
  );
};

export default MyMap;

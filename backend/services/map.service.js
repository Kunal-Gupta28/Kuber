const axios = require("axios");
const captainModel = require("../models/captain.model");

// function to ge geocode ( Latitude and Longitude ) from address
module.exports.getAddressCoordinates = async (address) => {
  const apiKey = process.env.GOOGLE_MAP_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "OK") {
      const result = data.results[0];
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
      };
    } else {
      console.log(
        "Geocode was not successful for the following reason:",
        data.status
      );
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// Service to get address from coordinates using Google Maps Geocoding API
module.exports.getReverseGeocode = async (userCoordinates) => {
  const apiKey = process.env.GOOGLE_MAP_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(
    userCoordinates
  )}&key=${apiKey}`;
  try {

    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "OK") {
      const result = data.results[0];
      return result.formatted_address;
    } else {
      throw new Error(`Geocoding failed: ${data.status}`);
    }
  } catch (error) {
    console.error("Error occurred during reverse geocoding:", error);
    throw error;
  }
};



// fucntion to calculate distance and time between pickupPoint and destination
module.exports.getDistanceTime = async (pickupPoint, destination) => {
  if (!pickupPoint || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAP_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    pickupPoint
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // If the request was successful
    if (data.status === "OK" && data.rows.length > 0) {
      const elements = data.rows[0].elements[0];

      if (elements.status === "OK") {
        const distance = elements.distance.text;
        const duration = elements.duration.text;

        return { distance, duration };
      } else {
        console.log("Error with travel details:", elements.status);
        return null;
      }
    } else {
      console.log("Error fetching data:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return null;
  }
};

module.exports.getAutoCompleteSuggestion = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }
  const apiKey = process.env.GOOGLE_MAP_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // Check if the response status is OK
    if (data.status === "OK") {
      const suggestions = data.predictions.map(
        (prediction) => prediction.description
      );
      return suggestions;
    } else {
      console.log("No suggestions found. Status:", data.status);
      return [];
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return [];
  }
};

module.exports.getCaptainInRange = async (ltd, lng, radius) => {
  try {
    const captain = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[ltd, lng], radius / 6371], // in Km
        },
      },
    });

    return captain;
  } catch (error) {
    console.error("Error fetching captains", error);

    return [];
  }
}; 

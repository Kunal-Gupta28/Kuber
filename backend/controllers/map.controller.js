const { validationResult } = require("express-validator");
const mapService = require("../services/map.service");

// Controller to get coordinates for a given address
module.exports.getAddressCoordinate = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const result = {};

    if (pickup) {
      result.pickup = await mapService.getAddressCoordinates(pickup);
    }

    if (destination) {
      result.destination = await mapService.getAddressCoordinates(destination);
    }

    if (!pickup && !destination) {
      return res.status(400).json({ message: "No address provided" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving coordinates", error: error.message });
  }
};

// Controller to handle reverse geocoding based on coordinates
module.exports.getReverseGeocode = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({ error: errors.array() });
  }

  const { userCoordinates } = req.query;

  try {

    const place = await mapService.getReverseGeocode(userCoordinates);


    return res.status(200).json({ address: place });
  } catch (error) {

    console.error("Reverse Geocode Error:", error);
    return res.status(500).json({ message: 'Error retrieving place', error: error.message });
  }
};

// Controller to get distance and time between two locations
module.exports.getDistanceTime = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { pickupPoint, destination } = req.query;

  try {
    let distance_time = await mapService.getDistanceTime(
      pickupPoint,
      destination
    );
    res.status(200).json(distance_time);
  } catch (error) {
    res.status(404).json({ message: "Data not found", error: error.message });
  }
};

// Controller to get address suggestions
module.exports.getAutoCompleteSuggestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const input = req.query.input;

  try {
    const suggestion = await mapService.getAutoCompleteSuggestion(input);
    res.status(200).json(suggestion);
  } catch (error) {
    console.error("Error fetching address suggestions:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
     
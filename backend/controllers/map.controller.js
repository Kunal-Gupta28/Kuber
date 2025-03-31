const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");

// Controller to get coordinates for a given address
module.exports.getAddressCoordinate = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { address } = req.query;

  try {
    let coordinate = await mapService.getAddressCoordinates(address);
    res.status(200).json(coordinate);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Coordinate not found", error: error.message });
  }
};

// Controller to get distance and time between two locations
module.exports.getDistanceTime = async (req, res, next) => {
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
module.exports.getAutoCompleteSuggestion = async (req, res, next) => {
  // const errors = validationResult(req);
  // console.log(errors)
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

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
 
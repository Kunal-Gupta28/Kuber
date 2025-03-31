const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");

module.exports.getFare = async (req, res, next) => {
  try {
    const { pickup, destination } = req.query;

    if (!pickup || !destination) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const fare = await rideService.getFare(pickup, destination);
    res.json(fare);
  } catch (error) {
    console.error("Error fetching fare:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createRide = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { pickupPoint, destination, vehicleType } = req.body;
 
  try {
    const ride = await rideService.createRideModel(
      req.user._id, 
      pickupPoint,
      destination,
      vehicleType,
    );
    

    return res.status(201).json(ride);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
 





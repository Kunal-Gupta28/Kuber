const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");

module.exports.createRide = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({ error: errors.array() });
  }
  const {pickupPoint, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
        userId: req.user._id,
        pickupPoint,
        destination,
        vehicleType,
    });
    return res.status(201).json(ride);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getFare = async (req, res,next) => {
  try {
    const { pickup, destination, vehicleType } = req.query;

    if (!pickup || !destination || !vehicleType) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const fare = rideService.getFare(pickup, destination, vehicleType);
    
    res.json({ fare });

  } catch (error) {
    console.error("Error fetching fare:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


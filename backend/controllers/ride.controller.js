const rideService = require("../services/ride.service");
const mapService = require("../services/map.service");
const rideModel = require("../models/ride.model");
const { validationResult } = require("express-validator");
const { sendMessageToSocketId } = require("../socket");

module.exports.getFare = async (req, res) => {
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

module.exports.createRide = async (req, res) => {
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
      vehicleType
    );
    res.status(201).json(ride);

    const pickupPointCoordinates = await mapService.getAddressCoordinates(
      pickupPoint
    );

    const captainInRange = await mapService.getCaptainInRange(
      pickupPointCoordinates.latitude,
      pickupPointCoordinates.longitude,
      2
    );

    ride.otp = "";

    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");
      
    captainInRange.map((captain) => {

      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.confirmRide = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { rideId } = req.body;
  try {
    const ride = await rideService.confirmRide({ rideId, captain: req.captain });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" }); 
    }

    if (!ride.user || !ride.user.socketId) {
      return res.status(400).json({ message: "User or socket ID missing" });
    }

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-confirmed',
      data: ride
    });

    return res.status(200).json(ride);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.startRide = async (req,res)=>{
  const error = validationResult(req)

  if(!error.isEmpty()){
    return res.status(400).json({error:error.array()})
  }

  const {rideId,otp} = req.query

  try {
    const ride = await rideService.startRide({rideId,otp,captain:req.captain})

    sendMessageToSocketId(ride.user.socketId,{
      event:'ride-start',
      data:ride
    })
    return res.status(200).json(ride)
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
} 

module.exports.endRide = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-ended',
      data: ride,
    });

    return res.status(200).json({ success: true, ride });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

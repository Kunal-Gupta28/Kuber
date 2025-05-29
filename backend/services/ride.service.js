const mongoose = require("mongoose");
const crypto = require("crypto");
const mapService = require("./map.service");
const rideModel = require("../models/ride.model");

// Get fare estimates based on pickup and destination
module.exports.getFare = async (pickupPoint, destination) => {
  if (!pickupPoint || !destination) {
    throw new Error("Pickup point and destination are required");
  }

  try {
    const distanceTime = await mapService.getDistanceTime(pickupPoint, destination);

    if (!distanceTime || !distanceTime.distance) {
      throw new Error("Could not retrieve distance and time data");
    }

    const distanceInKm = parseFloat(distanceTime.distance.split(" ")[0]);

    const baseFare = {
      KUberGo: 100,
      MOTO: 15,
      Premier: 200,
      KUberAuto: 50,
    };

    const distanceFactor = 10;

    const fares = Object.keys(baseFare).map((vehicleType) => ({
      vehicleType,
      fare: Math.round(baseFare[vehicleType] + distanceInKm * distanceFactor),
    }));

    return { distanceTime, fares };
  } catch (error) {
    console.error("Error fetching fares:", error.message);
    throw new Error("Error fetching fares: " + error.message);
  }
};

// Generate numeric OTP
module.exports.generateOTP = (num) => {
  return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num));
};

//  Create a new ride and store in database
module.exports.createRideModel = async (user, pickupPoint, destination, fare, distance, duration) => {
  try {
    if (!user || !pickupPoint || !destination || !fare || !distance || !duration ) {
      throw new Error("All fields are required");
    }

    const userId = new mongoose.Types.ObjectId(user);

    const otp = module.exports.generateOTP(6);

    const ride = await rideModel.create({
      user: userId,
      pickup: pickupPoint,
      destination,
      distance,
      duration,
      fare,
      otp,
    });

    return ride;
  } catch (error) {
    console.error("Error in createRideModel:", error.message);
    throw error;
  }
};

// Accept ride (Captain confirms)
module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId || !captain) {
    throw new Error("Ride ID and captain are required");
  }

  const updated = await rideModel.findOneAndUpdate(
    { _id: rideId },
    { status: "accepted", captain: captain._id },
    { new: true }
  ).populate("user").populate("captain").select("+otp");

  if (!updated) {
    throw new Error("Ride not found");
  }

  return updated;
};

//  Start ride after OTP confirmation
module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp || !captain) {
    throw new Error("Ride ID, OTP, and captain are required");
  }

  const ride = await rideModel.findOne({ _id: rideId })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) throw new Error("Ride not found");
  if (ride.status !== "accepted") throw new Error("Ride not accepted");
  if (ride.otp !== otp) throw new Error("Invalid OTP");

  ride.status = "ongoing";
  await ride.save();

  return ride;
};

// Complete the ride
module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId || !captain) {
    throw new Error("Ride ID and captain are required");
  }

  const ride = await rideModel.findOne({ _id: rideId, captain: captain._id })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) throw new Error("Ride not found");
  if (ride.status !== "ongoing") throw new Error("Ride is not ongoing");

  ride.status = "complete";
  await ride.save();

  return ride;
};
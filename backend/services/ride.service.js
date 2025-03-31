const mongoose = require("mongoose");
const crypto = require("crypto");
const mapService = require("../services/maps.service");
const rideModel = require("../models/ride.model");

module.exports.getFare = async (pickupPoint, destination) => {
  if (!pickupPoint || !destination) {
    throw new Error("Pickup point and destination are required");
  }

  try {
    const distanceTime = await mapService.getDistanceTime(pickupPoint, destination);

    if (!distanceTime || !distanceTime.distance) {
      throw new Error("Could not retrieve distance and time data");
    }

    const distance = parseFloat(distanceTime.distance.split(" ")[0]);

    const baseFare = {
      KUberGo: 100,
      MOTO: 15,
      Premier: 200,
      KUberAuto: 50,
    };

    const distanceFactor = 10;

    const fares = Object.keys(baseFare).map(vehicleType => ({
      vehicleType,
      fare: baseFare[vehicleType] + distance * distanceFactor,
    }));

    return fares;
  } catch (error) {
    console.error("Error fetching fares:", error.message);
    throw new Error("Error fetching fares: " + error.message);
  }
};


module.exports.generateOTP =  (num) => {  
  const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num));
  return otp;
};

module.exports.createRideModel = async (user, pickupPoint, destination, vehicleType) => {
  try {
    if (!user || !pickupPoint || !destination || !vehicleType) {
      throw new Error("All fields are required");
    }

    const userId = new mongoose.Types.ObjectId(user);

    console.log("User ID:", userId);
    console.log("Pickup Point:", pickupPoint);
    console.log("Destination:", destination);
    console.log("Vehicle Type:", vehicleType);

    // Get fare details
    const fareList = await module.exports.getFare(pickupPoint, destination);

    // Find the fare for the selected vehicle type
    const selectedFare = fareList.find(f => f.vehicleType === vehicleType);
    const finalFare = selectedFare ? selectedFare.fare : 0;

    // Generate OTP
    const otp = module.exports.generateOTP(6);

    // Create ride entry
    const ride = await rideModel.create({
      user: userId,
      pickup: pickupPoint,
      destination,
      vehicleType,
      otp: otp,
      fare: finalFare
    });

    return ride;
  } catch (error) {
    console.error("Error in createRideModel:", error);
    throw error;
  }
};

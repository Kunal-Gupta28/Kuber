const mapService = require("../services/maps.service");
const rideModel = require("../models/ride.model");

module.exports.getFare = async (pickupPoint, destination) => {
    if (!pickupPoint || !destination) {
      throw new Error("Pickup point and destination are required");
    }
  
    try {
      const distanceTime = await mapService.getDistanceTime(
        pickupPoint,
        destination
      );
  
      if (!distanceTime || !distanceTime.distance) {
        throw new Error("Could not retrieve distance and time data");
      } 
  
      const distance = parseFloat(distanceTime.distance.split(" ")[0]);
  
      const baseFare = {
        KUberAuto: 50,
        KUberGo: 100,
        Premier: 200,
        MOTO: 30,
      };
  
      const distanceFactor = 10;
  
      const fares = Object.keys(baseFare).map(vehicleType => ({
        vehicleType,
        fare: baseFare[vehicleType] + distance * distanceFactor,
      }));

      console.log(fares)
      return fares;
    } catch (error) {
      console.error("Error fetching fares:", error.message);
      throw new Error("Error fetching fares: " + error.message);
    }
  };
  

module.exports.genrateOTP = async (num) => {
  const otp = crypto.randomInt(
    Math.pow(10, num - 1),
    Math.pow(10, num).toString()
  );
  return otp;
}; 

module.exports.createRide = async (
  user,
  pickupPoint,
  destination,
  vehicleType
) => {
  if ((!user, !pickupPoint, !destination, !vehicleType)) {
    throw new Error("All fields are required");
  }
  const ride = await rideModel.create({
    user,
    pickupPoint,
    destination,
    vehicleType,
    otp: genrateOTP(6),
  });
  return ride;
};
      
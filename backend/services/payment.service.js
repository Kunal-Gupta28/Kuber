const { options } = require("../app");
const paymentConfig = require("../config/payment.config");
const rideModel = require("../models/ride.model");

module.exports.createOrder = async ({ rideId }) => {
  if (!rideId) {
    throw new Error({ message: "rideId is missing" });
  }
  try {
    const ride = await rideModel.findOne({ _id: rideId });
    paymentConfig.createOrder(options, (error, order) => {
      if (error) {
        res
          .status(500)
          .json({ message: "Something went worng", success: false });
      }
    });
    return ride;
  } catch (error) {
    throw new Error({ message: error });
  }
};



module.exports.verifyPayment = ()=>{}

    
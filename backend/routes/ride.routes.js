const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middlewares");

router.post(
  "/create",
  authMiddleware.authUser,
  body("pickupPoint")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup point"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination"),
  body("vehicleType")
    .isString()
    .isIn(["KUberAuto", "KUberGo", "Premier", "MOTO"])
    .withMessage("Invalid vehicleType"),
  rideController.createRide
);

router.get(
  "/get-fare",
  authMiddleware.authUser,
  query("pickupPoint")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup point"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination"),
  rideController.getFare
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  rideController.confirmRide
);

router.get('/start-ride',authMiddleware.authCaptain,
  query('rideId').isMongoId().withMessage('Invalid ride id'),
  query('otp').isString().isLength({min:6,max:6}).withMessage('Invalid OTP'),
  rideController.startRide
)

router.post('/end-ride',authMiddleware.authCaptain,
  body('rideId').isMongoId().withMessage('Invalid ride id'),
  rideController.endRide
)

module.exports = router; 
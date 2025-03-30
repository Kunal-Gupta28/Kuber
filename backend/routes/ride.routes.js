const express = require("express");
const router = express.Router();
const { body,query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middlewares");

router.get(
  "/create",
  authMiddleware.authUser,
  body("pickupPoint")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid user id"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid user id"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "eco cab", "premier", "motorcycle"])
    .withMessage("Invalid user id"),
  rideController.createRide
);

router.get(
  "/get-fare",
  authMiddleware.authUser,
  query("pickupPoint")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid user id"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid user id"),
  query("vehicleType")
    .isString()
    .isIn(["KUberAuto", "KUberGo", "Premier", "MOTO"])
    .withMessage("Invalid user id"),
  rideController.getFare
); 

module.exports = router;   
const express = require("express");
const { query } = require("express-validator");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middlewares");
const mapController = require("../controllers/map.controller");

// Route for converting address into coordinates
router.get(
  "/getAddressCoordinates",
  [
    query("address")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Address must be at least 3 characters long"),
  ],
  authMiddleware.authUser,
  mapController.getAddressCoordinate
);

// Route for calculating distance and time between pickup and destination
router.get(
  "/get-distance-time",
  [
    query("pickupPoint")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Pickup point must be at least 3 characters long"),
    query("destination")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Destination must be at least 3 characters long"),
  ],
  authMiddleware.authUser,
  mapController.getDistanceTime
);

// Route to get address suggestions
router.get(
  "/get-suggestion",
  // [
  //   query("input")
  //     .isString()
  //     .isLength({ min: 3 })
  //     .withMessage("Input query must be at least 3 characters long"),
  // ],
  authMiddleware.authUser,
  mapController.getAutoCompleteSuggestion
);

module.exports = router;

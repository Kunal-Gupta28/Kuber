const express = require("express");
const { query } = require("express-validator");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middlewares");
const mapController = require("../controllers/map.controller");

// Route for converting address into coordinates
router.get(
  "/getAddressCoordinates",
  [
    query("pickup")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Pickup address must be at least 3 characters long"),
    query("destination")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Destination address must be at least 3 characters long"),

    // Conditional auth middleware
    (req, res, next) => {
      const userType = req.query.userType || req.headers.usertype;
      if (userType === "captain") {
        return authMiddleware.authCaptain(req, res, next);
      } else {
        return authMiddleware.authUser(req, res, next);
      }
    },
  ],
  mapController.getAddressCoordinate
);


// Route for converting user current coordinates into address
router.get(
  "/getReverseGeocode",
  [
    query("userCoordinates")
      .isString()
      .withMessage("userCoordinates must be a string like 'latitude,longitude'"),
  ],
  authMiddleware.authUser,
  mapController.getReverseGeocode
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
  [
    query("input")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Input query must be at least 3 characters long"),
  ],
  authMiddleware.authUser,
  mapController.getAutoCompleteSuggestion
);

module.exports = router;
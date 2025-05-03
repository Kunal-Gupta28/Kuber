const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/auth.middlewares");
const upload = require("../middlewares/multer.middleware");

// register a new captain
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Vehicle color must be at least 3 characters long"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Vehicle plate must be at least 3 characters long")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Vehicle plate can only contain letters and numbers"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Vehicle capacity must be a positive number"),
    body("vehicle.vehicleType")
      .isIn(["KUberAuto", "KUberGo", "Premier", "MOTO"])
      .withMessage("Invalid vehicle type"),
  ],
  captainController.registerCaptain
);

// login a captain
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters long"),
  ],
  captainController.loginCaptain
);

// get captain profile
router.get(
  "/profile",
  authMiddleware.authCaptain,
  captainController.getCaptainProfile
);

// Upload profile image
router.post('/upload-profile-image', authMiddleware.authCaptain, upload.single('image'), captainController.uploadImage);

// update captain profile
router.get(
  "/update-profile",
  authMiddleware.authCaptain,
  captainController.updatateProfile
);

// logout a captain
router.get(
  "/logout",
  authMiddleware.authCaptain,
  captainController.logoutCaptain
);

module.exports = router;
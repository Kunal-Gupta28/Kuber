const express = require("express");
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Create order
router.post("/create-order", paymentController.createOrder);

// Verify payment signature
router.post("/verify", paymentController.verifyPayment);

module.exports = router;

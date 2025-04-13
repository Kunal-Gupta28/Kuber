const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const razorpayInstance = require("../config/payment.config");

// Endpoint to create order using controller
router.post('/create-order', paymentController.createOrder);

// Inline Razorpay order creation (test/demo route)
router.post('/checkout', async (req, res) => {
  try {
    const options = {
      amount: 5000, // amount in paise (5000 paise = ₹50)
      currency: 'INR',
      receipt: `rcptid_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("Order Created:", order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});

module.exports = router;

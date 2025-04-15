const paymentService = require("../services/payment.service");
const { validationResult } = require("express-validator");

module.exports.createOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { fare } = req.body;

  try {
    const order = await paymentService.createOrder({ fare });
    return res.status(200).json({
      success: true,
      data: order,
      message: "Order created successfully"
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports.verifyPayment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const isValid = await paymentService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (isValid) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

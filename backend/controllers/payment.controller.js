const paymentService = require("../services/payment.service");
const { validationResult } = require("express-validator");
const  {sendMessageToSocketId}  = require("../socket")

// create order
module.exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { amount } = req.body;

  // Basic validation for amount
  if (!amount || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount provided",
    });
  }

  try {
    const order = await paymentService.createOrder({ fare: amount });

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// verify payments
module.exports.verifyPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { orderId, paymentId, signature, socketId } = req.body;

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({
      success: false,
      message: "Missing payment verification data",
    });
  }

  try {
    const isValid = await paymentService.verifyPayment({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    });

    if (isValid) {
      if (socketId) {
        sendMessageToSocketId(socketId, {
          event: "PAYMENT_SUCCESS",
          data: {
            message: "Payment successfully",
            paymentId: paymentId,
            orderId: orderId
          }
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
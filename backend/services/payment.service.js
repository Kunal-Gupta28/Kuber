const razorpayInstance = require("../config/payment.config");
const crypto = require("crypto");

module.exports.createOrder = async ({ fare }) => {
  if (!fare) {
    throw new Error("Fare is missing");
  }

  const options = {
    amount: fare,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return order;  
  } catch (err) {
    console.error("Order creation error:", err);
    throw new Error("Failed to create order");
  }
};

module.exports.verifyPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error("razorpay_order_id, razorpay_payment_id, and razorpay_signature are required");
  }

  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_Secret_KEY)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return sign === razorpay_signature;
};


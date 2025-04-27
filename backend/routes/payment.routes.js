const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');


// Create order with validation
router.post("/create-order", body('amount')
.isNumeric()
.withMessage('Amount must be a number')
.isFloat({ min: 1 })
.withMessage('Amount must be greater than 0'),
body('currency')
.isString()
.withMessage('Currency must be a string')
.isLength({ min: 3, max: 3 })
.withMessage('Currency must be 3 characters long'),
body('receipt')
.isString()
.withMessage('Receipt must be a string')
.notEmpty()
.withMessage('Receipt is required'),
body('notes')
.optional()
.isObject()
.withMessage('Notes must be an object'), paymentController.createOrder);

// Verify payment with validation
router.post("/verify", body('orderId')
.isString()
.withMessage('Order ID must be a string')
.notEmpty()
.withMessage('Order ID is required'),
body('paymentId')
.isString()
.withMessage('Payment ID must be a string')
.notEmpty()
.withMessage('Payment ID is required'),
body('signature')
.isString()
.withMessage('Signature must be a string')
.notEmpty()
.withMessage('Signature is required'), paymentController.verifyPayment);

module.exports = router;

const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain'
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'complete', 'cancel'],
        default: 'pending',
    },
    duration: {
        type: Number,
    },
    time: {
        type: Number,
    },
    price: {
        type: Number,
    },
    otp: {
        type: String,
        required: true,
        select: false
    },
    paymentMethod: {
        type: String,
        enum: ["By Cash", "By UPI", "By Card"],
        default: 'By Cash',
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;

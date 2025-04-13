const {paymentService} = require('../services/payment.service')
const { validationResult } = require("express-validator")

module.exports.createOrder = async (req,res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        res.status(400).json({error: error.array()})
    }
    const {rideId} = req.body
try {
    
    const ride = await paymentService({rideId})
    
    return ride
} catch (error) {
    res.status(500).json({error:error})
}
    

}

module.exports.verifyPayment = async(req,res)=>{
    const {orderId,paymentId,signature} = req.body;
    try {
        
    } catch (error) {
        res.status(500).json({message:error})
    }
}


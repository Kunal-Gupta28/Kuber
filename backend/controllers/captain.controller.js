const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;


    try {
        const isCaptainAlreadyExists = await captainModel.findOne({email});

        if(isCaptainAlreadyExists){
            return res.status(400).json({message:'captain already exists'});
        }
    
        const hashedPassword = await captainModel.hashedPassword(password);

        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email ,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
        });

        // Generate authentication token
        const token = captain.generateAuthToken();

        res.status(201).json({ token, captain});
    } catch (error) {

        next(error);
    }
};
 
module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}


module.exports.getCaptainProfile = async (req, res, next) => {
    try {
        if (!req.captain) {
            return res.status(404).json({ message: 'Captain profile not found' });
        }
        res.status(200).json(req.captain);
    } catch (error) {
        next(error);
    }
};

module.exports.logoutCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        if (!token) {
            return res.status(400).json({ message: 'No token provided for logout' });
        }

        await blacklistTokenModel.create({ token });
        res.clearCookie('token', { httpOnly: true, secure: true }); // Ensure cookies are securely cleared
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {

        next(error);
    }
};

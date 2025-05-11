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

module.exports.uploadImage = async (req, res) => {
    const file = req.file;
    const captainId = req.captain._id;

    if (!file) {
        return res.status(400).json({ message: 'No image file provided' });
    }
    
    try {
      const updatedCaptain = await captainService.updateProfileImage(captainId, file);
      if (!updatedCaptain) {
        return res.status(404).json({ message: 'Captain not found' });
      }
      res.json({ image: updatedCaptain.image });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ message: 'Failed to upload profile image' });
    }
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

module.exports.updatateProfile = async (req, res, next) => {
    const {name,email,phone,profilePicture,vehicleNumber,vehicleModel,licenseNumber} = req.body;
      const captainId = req.captain._id;
    try {

        // Check if email is already taken by another captain
        if (email) {
            const existingCaptain = await captainModel.findOne({
                email,
                _id: { $ne: captainId },
            });
            if (existingCaptain) {
                return res.status(400).json({ message: 'Email is already taken' });
            }
        }

        const updatedCaptain = await captainModel.findByIdAndUpdate(
            captainId,
            {
                firstname: fullname.firstname,
                lastname: fullname.lastname,
                email,
                password,
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType,
            },
            { new: true, select: '-password' }
        );

        if (!updatedCaptain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        res.json(updatedCaptain);
    } catch (error) {
        next(error);
    }
}   

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

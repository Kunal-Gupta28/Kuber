const captainModel = require("../models/captain.model");
const userModel = require("../models/user.model");
const blackListedTokensModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const isBlackListed = await blackListedTokensModel.findOne({token: token});
    if (isBlackListed) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        const user = await userModel.findById(decoded._id);
        if (!user) {
            console.error("User not found in database:", decoded._id);
            return res.status(401).json({ message: "User not found" });
        }
    
        req.user = user;
        return next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
    
        const errorMessage = error.name === "TokenExpiredError"
            ? "Token expired"
            : "Unauthorized";
    
        return res.status(401).json({ message: errorMessage });
    }
     

} 

module.exports.authCaptain = async (req, res, next) => {
    try {
        // Extract token from cookies or authorization header
        const token = req.cookies.token ||  (req.headers.authorization?.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }

        // Check if the token is blacklisted
        const isBlackListed = await blackListedTokensModel.findOne({ token });

        if (isBlackListed) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }

        // Verify token and decode payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainModel.findById(decoded._id);


        if (!captain) {
            return res.status(401).json({ message: "Captain not found" });
        }

        // Attach captain data to request object
        req.captain = captain;
        next();
    } catch (error) {
        console.error('Error during authentication:', error);

        const errorMessage = error.name === "TokenExpiredError"
            ? "Token expired"
            : error.name === "JsonWebTokenError"
            ? "Invalid token"
            : "Authentication error";
        res.status(401).json({ message: errorMessage });
    }
};
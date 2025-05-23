const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });
  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const hashedPassword = await userModel.hashedPassword(password);

    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });

    // Generate authentication token
    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Error during user registration:", error);
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  
  try {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });

    }

    const token = user.generateAuthToken();

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error during user login:", error);
    next(error);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.updateProfile = async (req, res, next) => {
  const { name, profilePicture } = req.body;
  const userId = req.user._id;
  try {
    const updatedUser = await userService.updateProfile({name, profilePicture , userId});
    res.status(200).json({message: "Profile updated successfully", user: updatedUser});
  } catch (error) {
    console.error("Error updating user profile:", error);
    next(error);
  }
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  await blacklistTokenModel.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};

exports.uploadImage = async (req, res) => {
  const userId = req.user._id;
  const file = req.file;
  if (!file || !userId) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const updateProfileImage = await userService.updateProfileImage(userId, file);

    if (!updateProfileImage) {
      return res.status(400).json({ message: 'Failed to update profile image' });
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: file.path,
      public_id: file.filename,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

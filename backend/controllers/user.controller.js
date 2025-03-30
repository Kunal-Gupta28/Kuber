const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;
  console.log( "Fullname :",fullname)
  console.log("email :" , email)
  console.log("password :" , password);

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
    console.log(token)

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Error during user registration:", error);
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  console.log("email:", email);
  console.log("password",password);
  
  try {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
      console.log("email is missing");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
      console.log("password is missing");

    }

    const token = user.generateAuthToken();
    console.log("token:", token);

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error during user login:", error);
    next(error);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  await blacklistTokenModel.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};

const userModel = require("../models/user.model");

module.exports.createUser = async ({firstname, lastname, email, password}) => {
  if (!firstname || !lastname || !email || !password) {
    throw new Error("All fields are required");
  }

  try {
    const user = await userModel.create({
      fullname: {
        firstname:firstname,
        lastname:lastname,
      },
      email,
      password,
    });
    return user;

  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

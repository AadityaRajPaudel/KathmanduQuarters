const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const errorThrower = require("../utils/error.js");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: encryptedPassword,
  });
  try {
    await newUser.save();
    res.status(201).json({ message: "User added successfully!" });
  } catch (error) {
    // error is passed to the global error handler middleware
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorThrower(404, "User not found"));
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorThrower(401, "Wrong credentials"));
    // create a token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
};

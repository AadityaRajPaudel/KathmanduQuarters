const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const errorThrower = require("../utils/error.js");
const jwt = require("jsonwebtoken");

// const signup = async (req, res, next) => {
//   const { username, email, password } = req.body;

//   const encryptedPassword = bcrypt.hashSync(password, 10);

//   const newUser = new User({
//     username,
//     email,
//     password: encryptedPassword,
//   });
//   try {
//     await newUser.save();
//     res.status(201).json({ message: "User added successfully!" });
//   } catch (error) {
//     // error is passed to the global error handler middleware
//     next(error);
//   }
// };
const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Regular expression to enforce password validation
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      error:
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number.",
    });
  }

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
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // payload and secret key
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // if user exists, create token and return user details, else register the user by creating a random password
    // same idea as above
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  google,
};

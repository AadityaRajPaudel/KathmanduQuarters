const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");

authRouter.post("/signup", async (req, res, next) => {
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
});

module.exports = authRouter;

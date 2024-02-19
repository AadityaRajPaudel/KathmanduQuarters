const User = require("../models/user.model");
const errorThrower = require("../utils/error");
const bcrypt = require("bcrypt");
const Listing = require("../models/listing.model.js");

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorThrower(401, "You can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorThrower(401, "Unauthorized deletion"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};

const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(401, "You can only see your own listings");
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorThrower(404, "User Not Found"));

    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error.message);
  }
};

module.exports = { deleteUser, updateUser, getUserListings, getUser };

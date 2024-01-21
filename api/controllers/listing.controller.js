const Listing = require("../models/listing.model");
const errorThrower = require("../utils/error");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(errorThrower(404, "Listing not found"));

  if (req.user.id !== listing.userRef)
    return next(errorThrower(401, "You can only delete your own listing"));

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, messsage: "Listing has been deleted" });
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorThrower(404, "Listing not found"));
  if (req.user.id !== listing.userRef)
    return next(errorThrower(401, "You can only update your own listing"));

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ); // if new:true not done, we will get the old unupdated one
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorThrower(404, "Listing not found"));
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

module.exports = { createListing, deleteListing, updateListing, getListing };

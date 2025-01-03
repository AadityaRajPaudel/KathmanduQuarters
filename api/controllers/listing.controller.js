const Listing = require("../models/listing.model.js");
const errorThrower = require("../utils/error.js");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Couldnot create Listing" });
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

// for searching listings functionality
const getListings = async (req, res, next) => {
  try {
    let offer = req.query.offer; // offer can be true, false, or undefined

    // initially after clicking search, no matter what all listings with all offers must be shown
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    // if type is not defined or type is rent&sale
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    // searching listings based on all these factors below
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished, // think like furnished: furnished
      parking,
      type,
    }).sort({ [sort]: order });

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
};

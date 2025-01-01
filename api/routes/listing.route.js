const express = require("express");
const listingRouter = express.Router();
const {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} = require("../controllers/listing.controller.js");
const verifyToken = require("../utils/verifyUser.js");

listingRouter.post("/create", verifyToken, createListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing); // id of the listing
listingRouter.post("/update/:id", verifyToken, updateListing);
listingRouter.get("/get/:id", getListing);
listingRouter.get("/get", getListings);

module.exports = listingRouter;

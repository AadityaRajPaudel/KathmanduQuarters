const express = require("express");
const listingRouter = express.Router();
const createListing = require("../controllers/listing.controller.js");
const verifyToken = require("../utils/verifyUser.js");

listingRouter.post("/create", verifyToken, createListing);

module.exports = listingRouter;

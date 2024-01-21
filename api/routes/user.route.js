const express = require("express");
const {
  updateUser,
  deleteUser,
  getUserListings,
} = require("../controllers/user.controller.js");
const verifyToken = require("../utils/verifyUser.js");
const userRouter = express.Router();

userRouter.get("/", (req, res, next) => {
  res.json({ message: "Test user route" });
  next();
});

userRouter.post("/update/:id", verifyToken, updateUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);
userRouter.get("/listings/:id", verifyToken, getUserListings);

module.exports = userRouter;

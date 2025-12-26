import express from "express";
import {
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import verifyToken from "../utils/verifyUser.js";
export const userRouter = express.Router();

userRouter.get("/", (req, res, next) => {
  res.json({ message: "Test user route" });
  next();
});

userRouter.post("/update/:id", verifyToken, updateUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);
userRouter.get("/listings/:id", verifyToken, getUserListings);
userRouter.get("/:id", verifyToken, getUser);

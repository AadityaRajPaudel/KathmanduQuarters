import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.route.js";
import { authRouter } from "./routes/auth.route.js";
import { listingRouter } from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log(mongoose.connection.name);
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log(process.env.JWT_SECRET);
  });
const __filename = fileURLToPath(import.meta.url); // returns the absolute path of this file
const __dirname = path.dirname(__filename); // returns directory of this file, i.e c:users/acer/.../api

app.listen(process.env.PORT, () => {
  console.log("Server connected on port " + process.env.PORT);
});

// creating an api route
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "..", "client", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

// global error handler middleware to catch and handle errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

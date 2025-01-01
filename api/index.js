const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.route.js");
const authRouter = require("./routes/auth.route.js");
const cookieParser = require("cookie-parser");
const listingRouter = require("./routes/listing.route.js");
const cors = require("cors");
const path = require("path");

app.use(cors());
dotenv.config();
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log(mongoose.connection.name);
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log(err);
  });
const __dirname = path.resolve();

app.listen(process.env.PORT, () => {
  console.log("Server connected on port 3000...");
});

// creating an api route
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
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

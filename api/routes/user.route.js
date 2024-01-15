const express = require("express");
const userRouter = express.Router();
const { user, test } = require("../controllers/user.controller");

userRouter.get("/", user);

userRouter.get("/test", test);

module.exports = userRouter;

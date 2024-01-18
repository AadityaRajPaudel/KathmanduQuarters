const express = require("express");
const authRouter = express.Router();
const { signup, signin, google } = require("../controllers/auth.controller.js");

authRouter.post("/signup", signup);

authRouter.post("/signin", signin);

authRouter.post("/google", google);

module.exports = authRouter;

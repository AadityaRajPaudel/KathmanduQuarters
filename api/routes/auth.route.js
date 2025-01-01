import express from "express";
export const authRouter = express.Router();
import { signup, signin, google } from "../controllers/auth.controller.js";

authRouter.post("/signup", signup);

authRouter.post("/signin", signin);

authRouter.post("/google", google);

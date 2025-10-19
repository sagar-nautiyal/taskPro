import express from "express";
import UserController from "./user.controller.js";

const userRoute = express.Router();

const userController = new UserController();

userRoute.post("/register", (req, res) => {
  userController.registerUser(req, res);
});

userRoute.post("/login", (req, res) => {
  userController.signIn(req, res);
});
export default userRoute;

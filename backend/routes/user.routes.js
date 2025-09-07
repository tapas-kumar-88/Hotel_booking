import express from "express"
import { signup, login, logout, isAuth } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const userRouter = express.Router();

// Signup route
userRouter.post("/signup", signup);

// Login route
userRouter.post("/login", login);

userRouter.get("/is-auth",isAuthenticated, isAuth);

// Logout route
userRouter.get("/logout",isAuthenticated, logout);

export default userRouter;
import express from "express";
import { isAuth, loginUser, logoutUser, registerUser } from "../controllers/userController.js";
import { userAuth } from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post('/signup',registerUser);
userRouter.post('/login',loginUser);
userRouter.post('/is-auth',userAuth,isAuth);
userRouter.post('/logout',logoutUser);

export default userRouter;
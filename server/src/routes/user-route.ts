import express from "express";
import {
  getCartItem,
  getUser,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user-controller";
import { protectRoute } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadImage";
import { loginValidator, registerValidator } from "../validators/userValidator";
import { validateRequest } from "../middlewares/validateRequest";

const userRoute = express.Router();

userRoute.post("/register", registerValidator, validateRequest, register);
userRoute.post("/login", loginValidator, validateRequest, login);
userRoute.get("/getUser", protectRoute, getUser);
userRoute.patch(
  "/updateProfile",
  protectRoute,
  upload.single("profilePhoto"),
  updateProfile,
);
userRoute.get("/getCartItem", protectRoute, getCartItem);
userRoute.post("/logout", protectRoute, logout);

export default userRoute;

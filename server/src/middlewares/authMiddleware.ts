import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../types/customRequest";
import { User } from "../models/user.model";
import { ENV } from "../config/env";

export const protectRoute = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_TOKEN!,
    ) as JwtPayload;

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(decodedToken?.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userId = user._id;
    next();
  } catch (error) {
    console.error(`Error from product middleware, ${error}`);
  }
};

export const adminRoute = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Please login as an Admin" });
  }

  const user = await User.findById(userId);
  if (user?.email === ENV.ADMIN_EMAIL) {
    return res
      .status(401)
      .json({ message: "Access denied for non-admin users" });
  }
  next();
};

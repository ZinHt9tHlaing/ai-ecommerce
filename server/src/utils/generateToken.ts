import { Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

const generateToken = (res: Response, userId: Types.ObjectId) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN as string, {
    expiresIn: "7d", // 7 days
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
  });
};

export default generateToken;

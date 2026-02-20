import { Request, Response } from "express";
import { User } from "../models/user.model";
import generateToken from "../utils/generateToken";
import { ENV } from "../config/env";
import { CustomRequest } from "../types/customRequest";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({ name, password, email });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(`Error from register, ${error}`);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    const comparedPassword = await existingUser?.matchPassword(password);

    if (!existingUser || !comparedPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(res, existingUser._id);

    if (existingUser.email === ENV.ADMIN_EMAIL) {
      ((existingUser.owner = true), await existingUser.save());

      generateToken(res, existingUser._id);

      return res.json({
        message: `welcome back Admin ${existingUser.name}`,
      });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      _id: existingUser?._id,
    });
  } catch (error) {
    console.error(`Error from login, ${error}`);
  }
};

export const getUser = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(`Error from get user, ${error}`);
  }
};

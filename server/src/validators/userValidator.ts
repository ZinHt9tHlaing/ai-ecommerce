import { body } from "express-validator";

export const registerValidator = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password is required"),
];
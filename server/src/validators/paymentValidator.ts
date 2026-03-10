import { body } from "express-validator";

export const createCheckoutSessionValidator = [
  body("products").isArray({ min: 1 }).notEmpty().withMessage("Products is required"),
];

export const checkoutSuccessValidator = [
  body("sessionId").notEmpty().withMessage("Session ID is required"),
];
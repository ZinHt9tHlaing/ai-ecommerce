import { body, param } from "express-validator";

export const addToCartValidator = [
  body("productId").notEmpty().withMessage("Product ID is required"),
];

export const removeProductFromCartValidator = [
  body("productId").notEmpty().withMessage("Product ID is required"),
];

export const updateProductQuantityValidator = [
  param("id").notEmpty().withMessage("Product ID is required"),
  body("operation")
    .notEmpty()
    .isIn(["increase", "decrease"])
    .withMessage("Invalid operation"),
];

import { body, query } from "express-validator";

export const createProductValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").notEmpty().withMessage("Price is required"),
  body("category").notEmpty().withMessage("Category is required"),
];

export const updateTodoValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
];

export const getProductValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  query("search")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Search must be a non-empty string"),

  query("category")
    .optional()
    .isIn(["Jeans", "Pants", "Shirt", "Jacket", "Saree", "Shoes"])
    .withMessage("Invalid category"),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("minPrice must be a positive number")
    .toFloat(),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("maxPrice must be a positive number")
    .toFloat(),
];

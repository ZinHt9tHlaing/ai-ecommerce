import express from "express";
import {
  addToCart,
  removeFromCart,
  removeAllCart,
  updateProductQuantity,
} from "../controllers/cart-controller";
import { adminRoute, protectRoute } from "../middlewares/authMiddleware";

// cart validators
import {
  addToCartValidator,
  removeProductFromCartValidator,
  updateProductQuantityValidator,
} from "../validators/cartValidator";
import { validateRequest } from "../middlewares/validateRequest";

const cartRoute = express.Router();

cartRoute.post("/add-to-cart", protectRoute, addToCartValidator, addToCart);
cartRoute.delete(
  "/remove-from-cart",
  protectRoute,
  removeProductFromCartValidator,
  removeFromCart,
);
cartRoute.delete("/remove-all-cart", protectRoute, removeAllCart);
cartRoute.put(
  "/update-product-quantity/:id",
  protectRoute,
  updateProductQuantityValidator,
  validateRequest,
  updateProductQuantity,
);

export default cartRoute;

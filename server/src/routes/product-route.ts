import express from "express";
import {
  createProduct,
  deleteProduct,
  getFeaturedProduct,
  getProductController,
  getSingleProduct,
  toggleFeatureProducts,
} from "../controllers/product-controller";
import { adminRoute, protectRoute } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadImage";

const productRoute = express.Router();

productRoute.post(
  "/create-product",
  protectRoute,
  adminRoute,
  upload.single("image"),
  createProduct,
);
productRoute.get(
  "/get-all-products",
  protectRoute,
  adminRoute,
  getProductController,
);
productRoute.post(
  "/toggle-product/:id",
  protectRoute,
  adminRoute,
  toggleFeatureProducts,
);
productRoute.delete(
  "/delete-product/:id",
  protectRoute,
  adminRoute,
  deleteProduct,
);
productRoute.get('/single-product/:id', protectRoute, getSingleProduct)
productRoute.get("/featured-product", protectRoute,getFeaturedProduct);

export default productRoute;

import express from "express";
import {
  createCheckoutSession,
  checkoutSuccess,
} from "../controllers/payment-controller";
import { protectRoute } from "../middlewares/authMiddleware";
import {
  createCheckoutSessionValidator,
  checkoutSuccessValidator,
} from "../validators/paymentValidator";
import { validateRequest } from "../middlewares/validateRequest";

const paymentRoute = express.Router();

paymentRoute.post(
  "/create-checkout-session",
  protectRoute,
  createCheckoutSessionValidator,
  validateRequest,
  createCheckoutSession,
);
paymentRoute.post(
  "/checkout-success",
  protectRoute,
  checkoutSuccessValidator,
  validateRequest,
  checkoutSuccess,
);

export default paymentRoute;

import express from "express";
import {
  getDailySalesController,
  getAnalyticsController,
} from "../controllers/analytics-controller";
import { adminRoute, protectRoute } from "../middlewares/authMiddleware";

const analyticsRoute = express.Router();

analyticsRoute.get(
  "/getDate",
  protectRoute,
  adminRoute,
  getAnalyticsController,
);
analyticsRoute.get(
  "/daily-sales",
  protectRoute,
  adminRoute,
  getDailySalesController,
);

export default analyticsRoute;

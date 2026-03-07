import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

// routes
import userRoute from "./routes/user-route";
import productRoute from "./routes/product-route";
import cartRoute from "./routes/cart-route";

export const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app
  .use(bodyParser.json({ limit: "10mb" }))
  .use(bodyParser.urlencoded({ extended: true, limit: "10mb" }))
  .use(morgan("dev")) // request logger
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cookieParser())
  .use(helmet())
  .use(compression());

// dynamic routes
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)
app.use('/api/cart', cartRoute)


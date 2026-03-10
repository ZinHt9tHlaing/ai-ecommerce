import { Response } from "express";
import { CustomRequest } from "../types/customRequest";
import { stripe } from "../config/stripe";
import { ENV } from "../config/env";
import { Order } from "../models/order.mode";
import { ICartItem } from "../types/payment-types";
import { User } from "../models/user.model";

interface IMetadataProduct {
  id: string;
  quantity: number;
  price: number;
}

export const createCheckoutSession = async (
  req: CustomRequest,
  res: Response,
) => {
  try {
    const { products } = req.body;
    const userId = req.userId;

    if (!Array.isArray(products)) {
      return res.status(401).json({ message: "Empty products" });
    }

    let totalAmount = 0;
    const lineItems = products.map((item: ICartItem) => {
      const amount = Math.round(item.product.price * 100);
      totalAmount += amount * item.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            images: [item.product.image],
          },
          unit_amount: amount,
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${ENV.CLIENT_URL}/purchase?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ENV.CLIENT_URL}/purchase/cancel`,

      metadata: {
        userId: userId!.toString(),
        products: JSON.stringify(
          products.map((item: ICartItem) => ({
            id: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        ),
      },
    });

    return res.status(201).json({
      id: session.id,
      totalAmount: totalAmount / 100,
      url: session.url,
    });
  } catch (error) {
    console.log(`Error from create checkout session, ${error}`);
    res.status(500).json({ message: "Error from create checkout session" });
  }
};

export const checkoutSuccess = async (req: CustomRequest, res: Response) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "SessionId not found" });
    }

    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return res.status(409).json({ message: "Order already created" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.metadata) {
      return res.status(400).json({ message: "No metadata found on session" });
    }

    console.log("Payment status:", session.payment_status);
    console.log("Session:", session);

    if (session.payment_status === "paid") {
      const products: IMetadataProduct[] = JSON.parse(
        session.metadata.products,
      );

      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product: IMetadataProduct) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: (session.amount_total || 0) / 100,
        stripeSessionId: sessionId,
      });

      await newOrder.save();

      await User.findByIdAndUpdate(session.metadata.userId, {
        $set: { cartItem: [] },
      });

      return res.status(201).json({ message: "Payment completed" });
    }

    return res.status(400).json({ message: "Payment not completed" });
  } catch (error) {
    console.error(`Error from checkout success: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

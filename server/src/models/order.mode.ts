import mongoose from "mongoose";

interface Product {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IOrder {
  user: mongoose.Schema.Types.ObjectId;
  products: Product[];
  totalAmount: number;
  stripeSessionId: string;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    stripeSessionId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);

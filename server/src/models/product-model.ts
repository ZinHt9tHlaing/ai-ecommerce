import mongoose from "mongoose";

interface IProduct {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured: boolean;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      min: 0,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text" });

productSchema.index({ category: 1 }); // ascending order

productSchema.index({ price: 1 });

export const Product = mongoose.model<IProduct>("Product", productSchema);

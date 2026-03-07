import { Request, Response } from "express";
import { CustomRequest } from "../types/customRequest";
import { User } from "../models/user.model";

export const addToCart = async (req: CustomRequest, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const existingItem = user.cartItem.find(
      (item) => item.product.toString() === productId,
    );
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Product is already in the cart" });
    } else {
      user.cartItem.push({ quantity: 1, product: productId });
    }

    await user.save();

    return res.status(201).json({ message: "Product added to cart" });
  } catch (error) {
    console.error(`Error from add to cart, ${error}`);
    res.status(500).json({ message: "Error from add to cart" });
  }
};

export const removeFromCart = async (req: CustomRequest, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!productId) {
      return res.status(401).json({ message: "Product ID is required" });
    }

    await user.updateOne({
      $pull: { cartItem: { product: productId } },
    });

    return res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error(`Error from remove cart, ${error}`);
    res.status(500).json({ message: "Error from remove cart" });
  }
};

export const removeAllCart = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    user.cartItem = [];
    await user.save();

    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(`Error from remove all cart item, ${error}`);
    res.status(500).json({ message: "Error from remove all cart item" });
  }
};

export const updateProductQuantity = async (
  req: CustomRequest,
  res: Response,
) => {
  try {
    const productId = req.params.id;
    const { operation } = req.body;
    const userId = req.userId;

    if (!productId || !operation) {
      return res
        .status(401)
        .json({ message: "Product ID and quantity are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const item = user.cartItem.find(
      (item) => item.product.toString() === productId,
    );
    if (!item) {
      return res.status(401).json({ message: "Product not found" });
    }

    if (operation === "increase") {
      item.quantity += 1;
    } else if (operation === "decrease") {
      item.quantity -= 1;

      // if quantity is less than or equal to 0, remove the product from the cart
      if (item.quantity <= 0) {
        user.cartItem = user.cartItem.filter(
          (item) => item.product.toString() !== productId,
        );
      }
    } else {
      return res.status(401).json({ message: "Invalid operation" });
    }

    await user.save();

    return res
      .status(200)
      .json({
        message: "Product quantity updated successfully",
        cartItem: user.cartItem,
      });
  } catch (error) {
    console.error(`Error from update product quantity, ${error}`);
    res.status(500).json({ message: "Error from update product quantity" });
  }
};

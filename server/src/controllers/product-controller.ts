import { Product } from "./../models/product-model";
import { Request, Response } from "express";
import { deleteImage, uploadSingleImage } from "../config/cloudinary";
import { redis } from "../config/upstash-redis";
import { generateAIText } from "../services/ai.service";

// gemini ai
// const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(401).json({
        message: "Please provide all the details",
      });
    }

    let imageUrl = "";
    if (req.file) {
      // convert image to base64
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadRes = await uploadSingleImage(base64, "ai-shop.com/product");

      imageUrl = uploadRes.image_url;
    }

    const product = await Product.create({
      name,
      category,
      price,
      description,
      image: imageUrl,
    });

    // invalidate cache
    const keys = await redis.keys("products:*"); // get all keys

    if (keys.length > 0) {
      await redis.del(...keys); // delete all product of keys
    }

    return res.status(201).json(product);
  } catch (error) {
    console.error(`Error from create product, ${error}`);
    res.status(500).json({ message: "Error from create product" });
  }
};

export const getProductController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // On page 1, only 10 products will be shown
    // On page 2, the next 10 products will be shown and the first 10 products will be skipped
    // Then on page 3, the next 10 products will be shown and the previous 20 products will be skipped
    // And so on...

    const { search, category, minPrice, maxPrice } = req.query;

    const prompt = `You are an intelligent assistant for an E-commerce platform. A user will type any query about what they want. Your task is to understand the intent and return most relevant keyword from the following list of categories:
        - Jeans
        - Pants
        - Shirt
        - Jacket
        - Saree
        - Shoes

Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text. Query: "${search}"`;

    let aiText = null;

    const searchQuery =
      typeof req.query.search === "string" ? req.query.search : "";

    if (searchQuery.trim() !== "") {
      try {
        aiText = await generateAIText(prompt);
      } catch (error) {
        console.log("AI failed, fallback search");
        aiText = searchQuery;
      }
    }

    let aiCategory = category;

    const mongoQuery: any = {};

    if (aiText) {
      mongoQuery.$or = [
        { name: { $regex: aiText, $options: "i" } },
        { description: { $regex: aiText, $options: "i" } },
      ];
    }

    if (aiCategory) {
      mongoQuery.category = aiCategory;
    }

    if (minPrice || maxPrice) {
      mongoQuery.price = {};

      if (minPrice) mongoQuery.price.$gte = Number(minPrice);

      if (maxPrice) mongoQuery.price.$lte = Number(maxPrice);
    }

    // cache key based filter and pagination
    const cacheKey = `products:${JSON.stringify({
      page,
      limit,
      search: aiText ?? "",
      category: aiCategory ?? "",
      minPrice: minPrice ?? "",
      maxPrice: maxPrice ?? "",
    })}`;

    const cachedProducts = await redis.get(cacheKey);

    if (cachedProducts) {
      const data =
        typeof cachedProducts === "string"
          ? JSON.parse(cachedProducts)
          : cachedProducts;

      return res.status(200).json({ fromCached: true, ...data });
    }

    const [items, total] = await Promise.all([
      Product.find(mongoQuery).skip(skip).limit(limit).lean(),
      Product.countDocuments(mongoQuery),
    ]);

    if (!items) {
      const emptyPayload = {
        products: [],
        page,
        limit,
        total: 0,
        hasMore: false,
        appliedFilters: {
          search: aiText,
          category: aiCategory,
          minPrice,
          maxPrice,
        },
      };

      await redis.set(cacheKey, JSON.stringify(emptyPayload));
      return res.status(200).json({ fromCached: false, ...emptyPayload });
    }

    // calculate pages
    const totalPages = Math.ceil(total / limit); // 10/3 = 3.33 -> 4
    const hasMore = page < totalPages; // 1 < 4 -> true

    const payload = {
      products: items,
      page,
      limit,
      total,
      hasMore,
      appliedFilters: {
        search: aiText,
        category: aiCategory,
        minPrice,
        maxPrice,
      },
    };

    await redis.set(cacheKey, JSON.stringify(payload), {
      ex: 600, // 60s
    });

    return res.status(200).json({ fromCached: false, ...payload });
  } catch (error) {
    console.error(`Error from get product controller, ${error}`);
    res.status(500).json({ message: "Error from get product controller" });
  }
};

export const getFeaturedProduct = async (req: Request, res: Response) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    if (!featuredProducts) {
      return res.status(401).json({ message: "No featured products found" });
    }

    return res.status(200).json(featuredProducts);
  } catch (error) {
    console.error(`Error from get featured products, ${error}`);
    res.status(500).json({ message: "Error from get featured products" });
  }
};

export const toggleFeatureProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(401).json({ message: "No product found" });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    return res
      .status(200)
      .json({ message: "Product toggled successfully", product });
  } catch (error) {
    console.error(`Error from toggle feature products, ${error}`);
    res.status(500).json({ message: "Error from toggle feature products" });
  }
};

export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(401).json({ message: "No product found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(`Error from get single product, ${error}`);
    res.status(500).json({ message: "Error from get single product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(401).json({ message: "No product found" });
    }

    console.log("image", product.image);

    if (product.image) {
      const publicId = product.image.split("/").pop()?.split(".")[0];
      try {
        await deleteImage(`ai-shop.com/product/${publicId}`);
        console.log("cloudinary image deleted");
      } catch (error) {
        console.error(`Error from delete image, ${error}`);
      }
    }

    await product.deleteOne();

    const keys = await redis.keys("products:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(`Error from delete product, ${error}`);
    res.status(500).json({ message: "Error from delete product" });
  }
};

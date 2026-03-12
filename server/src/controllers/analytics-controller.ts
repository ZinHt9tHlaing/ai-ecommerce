import { Response } from "express";
import { CustomRequest } from "../types/customRequest";
import { User } from "../models/user.model";
import { Product } from "../models/product-model";
import { Order } from "../models/order.mode";
import { startOfDay, endOfDay } from "date-fns";

export const getData = async (req: CustomRequest, res: Response) => {
  const totalUser = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // groups all document together
        totalSales: { $sum: 1 }, // counts the number of orders
        totalRevenue: { $sum: "$totalAmount" }, // sums the total amount of all orders
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUser,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getAnalyticsController = async (req: CustomRequest, res: Response) => {
  try {
    const data = await getData(req, res);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(`Error from get analytics data, ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error from get analytics data",
    });
  }
};

export const getDailySalesData = async (startDate: Date, endDate: Date) => {
  try {
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // groups the documents by date
          sales: { $sum: 1 }, // counts the number of orders
          revenue: { $sum: "$totalAmount" }, // sums the total amount of all orders
        },
      },
      {
        $sort: { _id: 1 }, // sorts the documents by date
      },
    ]);

    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map((date) => {
      const foundDate = dailySales.find((item) => item._id === date);

      return {
        date,
        sales: foundDate?.sales || 0,
        revenue: foundDate?.revenue || 0,
      };
    });
  } catch (error) {
    console.error(`Error from get daily sales data, ${error}`);
  }
};

function getDatesInRange(startDate: Date, endDate: Date) {
  const dates = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export const getDailySalesController = async (
  req: CustomRequest,
  res: Response,
) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(401).json({
        message: "Please provide dates",
      });
    }

    const start = startOfDay(new Date(startDate as string));
    const end = endOfDay(new Date(endDate as string));

    const data = await getDailySalesData(start, end);

    return res.status(200).json(data);
  } catch (error) {
    console.log(`error from getDaily sales controller, ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error from getDaily sales controller",
    });
  }
};

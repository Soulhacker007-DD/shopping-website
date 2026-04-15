import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import mongoose from "mongoose";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const vendorId = searchParams.get("vendorId");

        if (!vendorId) {
            return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
        }

        await connectDb();

        // 📊 Step 1: Aggregate Sales Data
        const vendorOid = new mongoose.Types.ObjectId(vendorId);

        const salesStats = await Order.aggregate([
            { $match: { productVendor: vendorOid, orderStatus: { $ne: "cancelled" } } },
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.product",
                    totalQuantity: { $sum: "$products.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    title: "$productDetails.title",
                    totalQuantity: 1,
                    totalRevenue: 1,
                    category: "$productDetails.category"
                }
            },
            { $sort: { totalQuantity: -1 } }
        ]);

        const totalStats = await Order.aggregate([
            { $match: { productVendor: vendorOid, orderStatus: { $ne: "cancelled" } } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRev: { $sum: "$totalAmount" }
                }
            }
        ]);

        const summaryData = {
            totalOrders: totalStats[0]?.totalOrders || 0,
            totalRevenue: totalStats[0]?.totalRev || 0,
            bestSellers: salesStats.slice(0, 3)
        };

        // 🧠 Step 2: Use AI to generate advice
        const prompt = `You are a professional Business Analyst for an E-commerce platform. 
Here is the sales performance report for a vendor (ID: ${vendorId}):
- Total Orders: ${summaryData.totalOrders}
- Total Revenue: ₹${summaryData.totalRevenue}
- Best Selling Products: ${summaryData.bestSellers.map(p => `${p.title} (${p.totalQuantity} items, Category: ${p.category})`).join(", ")}

Generate a brief (max 100 words) strategic advice for this vendor. Mention which products they should restock and what kind of marketing strategy they need based on their performance.`;

        const result = await model.generateContent(prompt);
        const aiAdvice = result.response.text();

        return NextResponse.json({
            success: true,
            stats: summaryData,
            aiAdvice: aiAdvice,
            topPerformance: salesStats
        });

    } catch (error: any) {
        console.error("Vendor Insights Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

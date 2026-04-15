import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Product, { IProduct } from "@/models/product.model";
import Order, { IOrder } from "@/models/order.model";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        await connectDb();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        let recommendedProducts: IProduct[] = [];

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            // 1. Find user's past orders to get preferred categories
            const userOrders = await Order.find({ buyer: userId })
                .populate("products.product")
                .limit(10)
                .lean();

            const categories = new Set<string>();
            userOrders.forEach((order) => {
                order.products.forEach((p: any) => { // p.product is populated
                    const productData = p.product as unknown as IProduct;
                    if (productData?.category) {
                        categories.add(productData.category);
                    }
                });
            });

            if (categories.size > 0) {
                // 2. Recommend products from these categories (excluding already bought?)
                recommendedProducts = await Product.find({
                    category: { $in: Array.from(categories) },
                    verificationStatus: "approved",
                    isActive: true
                })
                .limit(8)
                .sort({ "reviews.rating": -1 })
                .lean();
            }
        }

        // 3. Fallback: Trending / Top Rated products
        if (recommendedProducts.length < 4) {
            const fallbackProducts = await Product.find({
                verificationStatus: "approved",
                isActive: true
            })
            .sort({ "reviews.rating": -1, createdAt: -1 })
            .limit(8 - recommendedProducts.length)
            .lean();

            // Merge and remove duplicates
            const existingIds = new Set(recommendedProducts.map(p => p._id.toString()));
            fallbackProducts.forEach(p => {
                if (!existingIds.has(p._id.toString())) {
                    recommendedProducts.push(p);
                }
            });
        }

        return NextResponse.json({ products: recommendedProducts });

    } catch (error: unknown) {
        console.error("RECOMMENDATIONS ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
    }
}

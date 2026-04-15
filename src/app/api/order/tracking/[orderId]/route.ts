import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";

export async function GET(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params;
        await connectDb();

        const order = await Order.findById(orderId)
            .select("orderStatus trackingUpdates address updatedAt createdAt")
            .lean();

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Prepare a structured tracking response
        const trackingHistory = order.trackingUpdates || [];

        // Add the initial creation as the first step if no updates
        if (trackingHistory.length === 0) {
            trackingHistory.push({
                status: "pending",
                message: "Order placed successfully",
                timestamp: order.createdAt
            });
        }

        return NextResponse.json({
            success: true,
            currentStatus: order.orderStatus,
            lastUpdated: order.updatedAt,
            history: trackingHistory,
            destination: {
                city: order.address?.city,
                pincode: order.address?.pincode
            }
        });

    } catch (error: any) {
        console.error("Order Tracking Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ Endpoint to add tracking update (for Vendors/Admins)
export async function POST(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params;
        const { status, message, location } = await req.json();

        await connectDb();

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: { orderStatus: status },
                $push: {
                    trackingUpdates: {
                        status,
                        message,
                        location,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Order status updated to ${status}`,
            order: updatedOrder
        });

    } catch (error: any) {
        console.error("Update Tracking Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { sendDeliveryOtpEmail } from "@/lib/mailer";
import { NotificationService } from "@/lib/notificationService";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, status } = await req.json();

    const order = await Order.findById(orderId)
      .populate("buyer")
      .populate("products.product");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    if (status === "confirmed" || status === "shipped") {
      order.orderStatus = status;
      await order.save();

      // 📩 Send Automated Notification (Email + SMS)
      try {
        const email = (order.buyer as any)?.email;
        if (email) {
          const items = order.products.map((p: any) => ({
            name: p.product?.title || "Product",
            quantity: p.quantity,
            price: p.price
          }));

          await NotificationService.sendOrderStatusUpdate(
            email,
            order._id.toString(),
            status,
            items,
            order.totalAmount
          );
        }
      } catch (notifErr) {
        console.error("Notification Error:", notifErr);
      }

      return NextResponse.json({ message: "Status updated" });
    }

    if (status === "delivered") {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      order.deliveryOtp = otp;
      order.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await order.save();

      const email = (order.buyer as any)?.email;
      if (!email) {
        return NextResponse.json(
          { message: "Buyer email not found" },
          { status: 400 }
        );
      }

      await sendDeliveryOtpEmail(email, otp);
      
      // Also send a "Out for Delivery" or "Delivered Pending" SMS
      console.log(`[SMS] To ${order.address.phone}: Your order #${order._id.toString().slice(-6)} is ready for delivery. OTP is ${otp}.`);

      return NextResponse.json({ message: "OTP sent to buyer email" });
    }

    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

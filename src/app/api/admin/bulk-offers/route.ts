import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { auth } from "@/auth";
import User from "@/models/user.model";
import { NotificationService } from "@/lib/notificationService";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        // 🔐 Admin Auth Check
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const admin = await User.findById(session.user.id);
        if (admin?.role !== 'admin' && admin?.role !== 'vendor') {
            return NextResponse.json({ message: "Admin/Vendor access required" }, { status: 403 });
        }

        const { discount, code, expiry } = await req.json();

        if (!discount || !code || !expiry) {
            return NextResponse.json({ message: "Missing campaign data" }, { status: 400 });
        }

        // 👥 Fetch all active users with valid emails
        const users = await User.find({ email: { $exists: true, $ne: "" } }).select('email name');

        // 🚀 Parallel Broadcast (Background)
        // Note: In real production, use a Queue like BullMQ or a service like Resend/SendGrid
        const broadcastPromise = Promise.all(users.map(async (u) => {
            try {
                await NotificationService.sendSpecialOffer(
                    u.email,
                    u.name || "Valued Customer",
                    code,
                    discount,
                    new Date(expiry).toLocaleDateString()
                );
                
                // 📱 SMS Simulation (Marketing)
                console.log(`[SMS-OFFER] To ${u.email}: Hey! Get ${discount}% OFF with code ${code} at Rushcart!`);
            } catch (err) {
                console.error(`Failed to notify ${u.email}:`, err);
            }
        }));

        // We don't necessarily want to wait for ALL emails to send before responding if the list is huge,
        // but for this implementation we'll wait for confirmation start.
        
        return NextResponse.json({ 
            message: `Broadcasting to ${users.length} users...`,
            count: users.length 
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Campaign initiation failed" }, { status: 500 });
    }
}

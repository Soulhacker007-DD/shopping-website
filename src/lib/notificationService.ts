import nodemailer from "nodemailer";

/**
 * 📨 Email Configuration
 */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

/**
 * 🛠️ Notification Service Base
 */
export class NotificationService {
    /**
     * Send Order Status Update Email
     */
    static async sendOrderStatusUpdate(to: string, orderId: string, status: string, items: any[], total: number) {
        const statusColors: any = {
            'confirmed': '#10b981', // green
            'shipped': '#3b82f6', // blue
            'delivered': '#8b5cf6', // purple
            'cancelled': '#ef4444' // red
        };

        const color = statusColors[status.toLowerCase()] || '#6366f1';

        await transporter.sendMail({
            from: `"Rushcart Fast-Track" <${process.env.GMAIL_USER}>`,
            to,
            subject: `Update on Order #${orderId.substring(orderId.length - 6)} - ${status.toUpperCase()}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background: #0a0a0a; color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #333;">
                    <div style="background: linear-gradient(135deg, ${color} 0%, #000000 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">ORDER ${status.toUpperCase()}</h1>
                        <p style="opacity: 0.8; margin-top: 10px;">Order ID: #${orderId}</p>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
                        <p style="font-size: 16px; line-height: 1.6;">Good news! Your order status has been updated to <strong>${status}</strong>. We are moving as fast as possible to get your items to you.</p>
                        
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; margin: 20px 0;">
                            <h3 style="margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px;">Order Summary</h3>
                            ${items.map(item => `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <span style="opacity: 0.7;">${item.name} x${item.quantity}</span>
                                    <span>₹${item.price}</span>
                                </div>
                            `).join('')}
                            <div style="border-top: 1px solid #333; margin-top: 10px; padding-top: 10px; font-weight: bold; display: flex; justify-content: space-between;">
                                <span>Total Paid</span>
                                <span style="color: ${color};">₹${total}</span>
                            </div>
                        </div>

                        <a href="${process.env.NEXT_BASE_URL}/user/orders" style="display: inline-block; background: ${color}; color: white; text-decoration: none; padding: 12px 30px; border-radius: 10px; font-weight: bold; margin-top: 20px;">Track Live Status</a>
                        
                        <p style="margin-top: 40px; font-size: 12px; opacity: 0.5; text-align: center;">
                            Thank you for shopping with Rushcart.<br/>
                            This is an automated notification.
                        </p>
                    </div>
                </div>
            `,
        });

        // 📱 SMS Simulation
        console.log(`[SMS Automation] Sending to ${to}: Your order #${orderId.substring(orderId.length - 6)} is now ${status}. Track at Rushcart.`);
    }

    /**
     * Send Marketing Offer
     */
    static async sendSpecialOffer(to: string, userName: string, offerCode: string, discount: string, expiry: string) {
        await transporter.sendMail({
            from: `"Rushcart Prime" <${process.env.GMAIL_USER}>`,
            to,
            subject: `Exclusive ${discount}% OFF just for you, ${userName}! 🎁`,
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; text-align: center; background: #000; color: #fff; padding: 40px; border-radius: 25px; border: 1px solid #7c3aed;">
                    <div style="background: linear-gradient(to bottom right, #7c3aed, #db2777); border-radius: 20px; padding: 40px;">
                        <h1 style="font-size: 40px; margin: 0;">SPECIAL OFFER</h1>
                        <p style="font-size: 20px; opacity: 0.9;">Hello ${userName}, we missed you!</p>
                        <div style="margin: 30px 0; border: 2px dashed #fff; padding: 20px; border-radius: 10px;">
                            <span style="font-size: 14px; display: block; opacity: 0.7;">Use Code:</span>
                            <strong style="font-size: 32px; letter-spacing: 5px;">${offerCode}</strong>
                        </div>
                        <h2 style="font-size: 48px;">GET ${discount}% OFF</h2>
                        <p>Valid until: <strong>${expiry}</strong></p>
                        <a href="${process.env.NEXT_BASE_URL}" style="display: inline-block; background: #fff; color: #000; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; margin-top: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">Shop the Collection</a>
                    </div>
                </div>
            `,
        });
    }

    /**
     * Send Welcome Email
     */
    static async sendWelcomeEmail(to: string, userName: string) {
        await transporter.sendMail({
            from: `"Rushcart Welcome" <${process.env.GMAIL_USER}>`,
            to,
            subject: `Welcome to the Grid, ${userName}! ⚡`,
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; text-align: center; background: #000; color: #fff; padding: 40px; border-radius: 25px; border: 1px solid #3b82f6;">
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #000 100%); border-radius: 20px; padding: 40px;">
                        <h1 style="font-size: 40px; margin: 0; letter-spacing: 2px;">WELCOME ABOARD</h1>
                        <p style="font-size: 18px; opacity: 0.8; margin: 20px 0;">Hello ${userName}, your Rushcart terminal is now active.</p>
                        <p style="font-size: 14px; opacity: 0.6; line-height: 1.6;">Access the most advanced AI-powered shopping ecosystem in the sector. Browse high-performance catalogs, track orders with pinpoint accuracy, and unlock exclusive member nodes.</p>
                        <a href="${process.env.NEXT_BASE_URL}" style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; margin-top: 30px;">Initialize Dashboard</a>
                    </div>
                    <p style="font-size: 10px; opacity: 0.3; margin-top: 30px;">Digital Signature Verified by Rushcart Nodes</p>
                </div>
            `,
        });
    }
}

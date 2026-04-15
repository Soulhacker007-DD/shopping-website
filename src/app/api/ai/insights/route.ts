import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { retryWithBackoff } from "@/lib/ai-utils";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) {
            return NextResponse.json({ error: "AI Service Configuration Error" }, { status: 500 });
        }

        const { orders, products } = await req.json();

        if (!orders || !products) {
            return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Optimize data sent to Gemini to stay within context limits
        const orderSummary = orders.slice(-50).map((o: any) => ({
            id: o._id,
            total: o.totalAmount,
            status: o.orderStatus,
            items: o.products.map((p: any) => ({
                quantity: p.quantity,
                title: p.product?.title,
                price: p.price
            }))
        }));

        const productSummary = products.map((p: any) => ({
            title: p.title,
            stock: p.stock,
            price: p.price,
            category: p.category
        }));

        const prompt = `Analyze the following store data and provide 3 tactical, high-value sales insights in JSON format.
        
        Order History (Last 50): ${JSON.stringify(orderSummary)}
        Current Inventory: ${JSON.stringify(productSummary)}

        Respond ONLY with a JSON array of 3 objects in this format:
        [
          {
            "type": "success" | "warning" | "info",
            "title": "Short catchy title (e.g. Demand Surge)",
            "message": "Specific actionable insight based on the data",
            "action": "Label for action button (e.g. Restock Now)"
          }
        ]
        
        Focus on:
        1. Top sellers and growth trends.
        2. Inventory/Liquidation risks (low stock/slow movement).
        3. Predicted market opportunities (based on categories).
        Ensure the 'message' is detailed and references specific products or trends.`;

        const result = await retryWithBackoff(() => 
            model.generateContent(prompt)
        );
        
        const responseText = result.response.text().replace(/```json|```/g, '').trim();
        const insights = JSON.parse(responseText);

        return NextResponse.json({ insights });

    } catch (error: any) {
        console.error("INSIGHTS AI ERROR:", error);
        return NextResponse.json({ error: "Failed to generate AI insights" }, { status: 500 });
    }
}

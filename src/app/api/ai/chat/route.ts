import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import Chat from "../../../../models/chat.model";
import { retryWithBackoff } from "@/lib/ai-utils";


export async function POST(req: Request) {
    try {
        await connectDb();

        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing");
            return NextResponse.json({ error: "AI Service Configuration Error" }, { status: 500 });
        }

        const { message, userId: rawUserId, pageContext } = await req.json();
        const userId = (rawUserId === 'guest' || !rawUserId) ? null : rawUserId;
        
        console.log("AI Chat Request:", { userId, messageLength: message?.length, pageContext });

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // 📜 Fetch Chat History if userId is present
        let history = [];
        let dbChat: any = null;
        if (userId) {
            try {
                dbChat = await Chat.findOne({ userId });
                if (dbChat) {
                    history = dbChat.messages.slice(-12).map((m: any) => ({
                        role: m.role === "user" ? "user" : "model",
                        parts: [{ text: m.content }]
                    }));
                }
            } catch (dbErr) {
                console.error("History DB Error:", dbErr);
            }
        }

        // 🔍 Keyword detection for commerce context
        const keywords = message.toLowerCase().split(' ').filter((w: string) => w.length > 3);

        let productContext = "";
        if (keywords.length > 0) {
            try {
                const searchProducts = await Product.find({
                    $or: [
                        { title: { $regex: keywords.join('|'), $options: 'i' } },
                        { category: { $regex: keywords.join('|'), $options: 'i' } }
                    ],
                    verificationStatus: "approved",
                    isActive: true
                }).limit(4).lean();

                if (searchProducts.length > 0) {
                    productContext = "\n\nStore Context (Highly relevant products):\n" +
                        searchProducts.map((p: any) =>
                            `- ${p.title} (Price: ₹${p.price}, ID/Link: /view-product/${p._id})`
                        ).join('\n');
                }
            } catch (dbErr) {
                console.error("Context Search DB Error:", dbErr);
            }
        }

        const systemInstruction = `You are "Rushcart AI", a helpful commerce assistant. 
User's Current Page: ${pageContext || 'Home/Unknown'}
Be concise and use markdown.
${productContext}`;

        // --- Execution-Aware Model Discovery ---
        let responseText = "";
        let success = false;
        const modelList = [
            "gemini-2.5-flash", 
            "gemini-2.0-flash", 
            "gemini-flash-latest",
            "gemini-2.5-pro"
        ];

        for (const mName of modelList) {
            try {
                console.log(`📡 Trying AI Chat model: ${mName}...`);
                const model = genAI.getGenerativeModel({ model: mName });

                const chatSession = model.startChat({
                    history,
                    generationConfig: { maxOutputTokens: 1000 },
                });

                const result = await retryWithBackoff(() => 
                    chatSession.sendMessage(`${systemInstruction}\n\nUser Question: ${message}`)
                );

                if (result?.response) {
                    responseText = result.response.text();
                    success = true;
                    console.log(`✅ Google AI Chat: Success on model ${mName}`);
                    break; 
                }
            } catch (err: any) {
                console.warn(`❌ Model ${mName} execution failed:`, err.message);
                // Try next alias
            }
        }

        if (!success || !responseText) {
            console.error("🔴 ALL CHAT MODELS FAILED OR QUOTA EXCEEDED");
            return NextResponse.json({ 
                error: "AI service is temporarily overloaded or unavailable.",
                details: "Please try again in 60 seconds."
            }, { status: 503 });
        }

        // 💾 Persist History
        if (userId) {
            try {
                const targetChat = await Chat.findOne({ userId }) || new Chat({ userId, messages: [] });
                targetChat.messages.push({ role: "user", content: message, timestamp: new Date() });
                targetChat.messages.push({ role: "model", content: responseText, timestamp: new Date() });
                await targetChat.save();
            } catch (dbErr) {
                console.error("Save Chat History Error:", dbErr);
            }
        }

        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error("🔴 CRITICAL AI CHAT ERROR:", {
            message: error.message,
            status: error.status,
            stack: error.stack
        });

        return NextResponse.json({ 
            error: error.message || "AI Process Failed",
            details: "Check server logs for root cause.",
            status: 500
        }, { status: 500 });
    }
}

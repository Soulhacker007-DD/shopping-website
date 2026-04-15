import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { retryWithBackoff } from "@/lib/ai-utils";

export async function POST(req: Request) {
    try {
        await connectDb();
        
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing from environment variables");
            return NextResponse.json({ error: "Configuration Error: API Key Missing" }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "No image file provided" }, { status: 400 });
        }

        console.log(`Image received: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "Image too large (Max 10MB allowed)" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Try vision models in priority order and ACTUALLY test them
        let result: any = null;
        let activeModelName = "";
        const modelList = [
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-flash-latest",
            "gemini-2.5-pro"
        ];
        
        const prompt = "Act as an e-commerce specialist. Identify the main product in this image and provide a 3-word search query (Nouns only). Examples: 'Blue sneakers sport', 'Denim jacket men'. Output ONLY the 3 words.";

        for (const mName of modelList) {
            try {
                console.log(`📡 Trying Vision model: ${mName}...`);
                const model = genAI.getGenerativeModel({ model: mName });
                
                result = await retryWithBackoff(() => 
                    model.generateContent([
                        { text: prompt },
                        {
                            inlineData: {
                                data: base64Image,
                                mimeType: file.type || "image/jpeg"
                            }
                        }
                    ])
                );

                if (result?.response) {
                    activeModelName = mName;
                    console.log(`✅ Google AI Vision: Success on model ${mName}`);
                    break; 
                }
            } catch (err: any) {
                console.warn(`❌ Vision model ${mName} execution failed:`, err.message);
                // Continue to next model in list
            }
        }
        
        if (!result || !result.response) {
            console.error("🔴 ALL VISION MODELS FAILED OR QUOTA EXCEEDED");
            return NextResponse.json({ 
                error: "All Vision AI models are currently unavailable or your quota is exceeded.",
                details: "Please try again in 60 seconds."
            }, { status: 503 });
        }

        let searchQuery = "";
        try {
            searchQuery = result.response.text().trim().replace(/['"]+/g, '');
        } catch (textErr) {
            console.error("Text parsing error (Blocked content?):", textErr);
            return NextResponse.json({ 
                error: "AI was unable to identify a product in this image due to safety filters or poor quality.",
                details: "Vision Blocked"
            }, { status: 400 });
        }

        console.log("AI Search Query Result:", searchQuery);
        const keywords = searchQuery.toLowerCase().split(' ').filter(w => w.length > 2);
        
        if (keywords.length === 0) {
            return NextResponse.json({ searchQuery, products: [], matchCount: 0 });
        }

        // Search in DB
        const flexRegex = new RegExp(keywords.join('|'), 'i'); 
        
        const products = await Product.find({
            $or: [
                { title: { $regex: flexRegex } },
                { category: { $regex: flexRegex } },
                { description: { $regex: flexRegex } }
            ],
            verificationStatus: "approved",
            isActive: true
        }).limit(20).lean();

        return NextResponse.json({ 
            searchQuery, 
            products,
            matchCount: products.length 
        });

    } catch (error: any) {
        console.error("🔴 CRITICAL IMAGE SEARCH API ERROR:", {
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json({ 
            error: error.message || "Visual Search Failed",
            details: "Ensure your API key is active and the image is clear.",
            status: 500
        }, { status: 500 });
    }
}

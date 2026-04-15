import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import path from "path";

async function diagnose() {
    config({ path: path.join(process.cwd(), ".env.local") });
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found in .env.local");
        return;
    }

    console.log(`Diagnosing API Key: ${apiKey.substring(0, 10)}...`);
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // We can't directly list models easily with this SDK without an Axios call, 
        // but we can try a VERY simple health check on the most basic model.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello. This is a health check. Reply with 'OK'.");
        console.log("Health Check Result:", result.response.text());
        console.log("✅ API KEY IS ACTIVE AND gemini-1.5-flash IS ENABLED.");
    } catch (e: any) {
        console.error("❌ HEALTH CHECK FAILED:", e.message);
        if (e.status === 404) {
            console.log("TIP:gemini-1.5-flash not found. Maybe this key only supports legacy models?");
        } else if (e.status === 429) {
            console.log("TIP: You are hitting RATE LIMITS (too many requests). Wait 60 seconds.");
        }
    }
}

diagnose();

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY is missing from .env.local" }, { status: 401 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Use a hidden/legacy method to list models if available, 
        // or just try basic connectivity check
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Keep it short: Hello, are you active?");
            return NextResponse.json({ 
                status: "Success",
                modelUsed: "gemini-pro",
                response: result.response.text(),
                keySnippet: apiKey.substring(0, 5) + "..."
            });
        } catch (innerErr: any) {
            return NextResponse.json({ 
                status: "Connectivity Error",
                message: innerErr.message,
                stack: innerErr.stack,
                suggestion: "If you see 404, verify that your API Key is created at https://aistudio.google.com/ and has 'Generative Language API' enabled."
            }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

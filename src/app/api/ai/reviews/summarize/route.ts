import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Product from "@/models/product.model";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await connectDb();

    const product = await Product.findById(productId).select("reviews title");

    if (!product || !product.reviews || product.reviews.length === 0) {
      return NextResponse.json({
        success: true,
        summary: "No reviews yet. Be the first to review this product!"
      });
    }

    // ⭐ Aggregate review comments
    const reviewTexts = product.reviews
      .filter((r: any) => r.comment)
      .map((r: any) => `- ${r.comment} (Rating: ${r.rating}/5)`)
      .join("\n");

    if (!reviewTexts) {
      return NextResponse.json({
        success: true,
        summary: "Not enough textual feedback to generate a summary."
      });
    }

    // 🧠 AI Processing
    const prompt = `Here are some customer reviews for the product "${product.title}":
${reviewTexts}

Please provide a concise summary (max 80 words) of the overall sentiment and common pros/cons mentioned by customers. 
If the feedback is contradictory, mention that too. 
Format: "Overall: [Summary]. Pros: [List]. Cons: [List]."`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({
      success: true,
      count: product.reviews.length,
      aiSummary: summary
    });

  } catch (error: any) {
    console.error("Review Summarization Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { auth } from "@/auth";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";

export async function GET(req:NextRequest) {
    try {
        await connectDb();
        const session = await auth()
        if(!session || !session.user){
            return NextResponse.json({message:"User is not authenticated"},{status:401})
        }
        const user = await User.findOne({email:session.user.email}).select("-password").populate("cart.product")
        if(!user){
            return NextResponse.json({message:"User is not found"},{status:404})
        }
        return NextResponse.json(user ,{status:200})

    } catch (error) {
         return NextResponse.json({message:`Get Current User error ${error}`},{status:500})
    }
    
}
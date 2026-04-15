"use client";
import React from "react";
import Slider from "./slider";
import CategoriesSlider from "./categories";
import ProductsPageForUserInterface from "./productPageForUserInterface";
import ShopsPage from "@/app/shop/page";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Activity, Globe } from "lucide-react";

import RecommendedProducts from "./RecommendedProducts";

function UserDashboard() {
  return (
    <div className="w-full flex min-h-screen bg-black font-sans flex-col relative overflow-hidden">
      {/* Cinematic Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-[80vh] bg-gradient-to-b from-blue-600/5 via-black to-black pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* CORE MODULE STACK */}
      <main className="relative z-10 w-full">
        <Slider />
        
        <div className="space-y-40 pb-40">
           <CategoriesSlider />
           <RecommendedProducts />
           <ProductsPageForUserInterface />
           <ShopsPage />
        </div>
      </main>

      {/* SCANNER LINE ANIMATION */}
      <motion.div 
        className="fixed bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-50 pointer-events-none"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default UserDashboard;

"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import UserProductCard from "./userProductCard";
import { Sparkles, TrendingUp } from "lucide-react";

export default function ProductsPageForUserInterface() {
  const { allProductsData } = useSelector(
    (state: RootState) => state.vendor
  );

  const visibleProducts = useMemo(() => {
    if (!Array.isArray(allProductsData)) return [];
    return allProductsData.filter(
      (p: any) =>
        p.isActive === true && p.verificationStatus === "approved"
    );
  }, [allProductsData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-transparent px-4 py-20"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto mb-20 text-center relative z-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
        >
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Curated Collection</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
          Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Trending</span> Products
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
          Shop with ultimate confidence from our network of pre-approved global sellers with guaranteed quality standards.
        </p>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[3rem] border border-white/10 gap-4">
            <Sparkles className="w-12 h-12 text-gray-700 animate-pulse" />
            <p className="text-xl font-medium text-gray-500">The collection is being replenished. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleProducts.map((product: any) => (
              <UserProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  Heart
} from "lucide-react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/models/product.model";
import axios from "axios";

export default function UserProductCard({ product }: { product: IProduct }) {
  const router = useRouter();

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);

  const [current, setCurrent] = useState(0);

  const openProduct = () => {
    router.push(`/view-product/${product._id}`);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const res = await axios.post("/api/cart/add", {
        productId: product._id,
        quantity: 1,
      });

      if (res.status === 200) {
        alert("✅ Added to cart");
      }
      router.push("/cart")
    } catch (err: any) {
      console.log(err);
      alert(err?.response?.data?.message || "Add to cart failed ❌");
    }
  };

  const reviews = product.reviews ?? [];
  const totalReviews = reviews.length;

  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum: number, r: { rating: number }) => sum + r.rating,
            0
          ) / totalReviews
        ).toFixed(1)
      : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)] cursor-pointer"
      onClick={openProduct}
    >
      {/* ================= IMAGE SECTION ================= */}
      <div className="relative w-full aspect-square overflow-hidden bg-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full p-6"
          >
            <Image
              src={images[current]}
              alt={product.title}
              fill
              className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/40">
            {product.category}
          </span>
        </div>

        {/* Hover Actions */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Controls */}
        {images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={prev}
              className="w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                current === i ? "w-6 bg-blue-500" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= INFO SECTION ================= */}
      <div className="p-8 pt-4 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              {product.vendor?.shopName || "Authentic Store"}
            </span>
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] font-bold text-white">{avgRating}</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Price</span>
            <span className="text-2xl font-black text-white tracking-tighter">
              ₹ {product.price.toLocaleString()}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

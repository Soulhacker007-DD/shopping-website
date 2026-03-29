"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Smartphone, 
  Home as HomeIcon, 
  Sparkles, 
  Baby, 
  ShoppingCart, 
  Trophy, 
  Car, 
  Gift, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Zap,
  Layers
} from "lucide-react";

const categories = [
  { label: "Fashion & Lifestyle", icon: ShoppingBag, color: "text-pink-500", glow: "shadow-pink-500/20" },
  { label: "Electronics & Gadgets", icon: Smartphone, color: "text-blue-500", glow: "shadow-blue-500/20" },
  { label: "Home & Living", icon: HomeIcon, color: "text-amber-500", glow: "shadow-amber-500/20" },
  { label: "Beauty & Personal Care", icon: Sparkles, color: "text-purple-500", glow: "shadow-purple-500/20" },
  { label: "Toys, Kids & Baby", icon: Baby, color: "text-green-500", glow: "shadow-green-500/20" },
  { label: "Food & Grocery", icon: ShoppingCart, color: "text-lime-500", glow: "shadow-lime-500/20" },
  { label: "Sports & Fitness", icon: Trophy, color: "text-orange-500", glow: "shadow-orange-500/20" },
  { label: "Automotive Accessories", icon: Car, color: "text-slate-500", glow: "shadow-slate-500/20" },
  { label: "Gifts & Handcrafts", icon: Gift, color: "text-indigo-500", glow: "shadow-indigo-500/20" },
  { label: "Books & Stationery", icon: BookOpen, color: "text-teal-500", glow: "shadow-teal-500/20" },
];

export default function CategoriesSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 5) % categories.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - 5 < 0 ? categories.length - 5 : prev - 5
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="w-full mx-auto py-32 px-8 bg-transparent relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-l border-white/10 pl-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Asset_Inventory_Sync</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                Protocol<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Classification</span>
              </h2>
           </div>
           <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] max-w-sm leading-relaxed mb-2">
             Filter the global fleet by specialized asset classes. Select a category node to initialize catalog retrieval.
           </p>
        </header>

        <div className="relative group/slider">
          <AnimatePresence mode="wait">
            <motion.div
              key={startIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
            >
              {categories.slice(startIndex, startIndex + 5).map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -15,
                    border: "1px solid rgba(255,255,255,0.2)"
                  }}
                  className={`relative group/card overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] cursor-pointer text-white transition-all duration-500 ${item.glow}`}
                  onClick={() =>
                    router.push(
                      `/category?category=${encodeURIComponent(item.label)}`
                    )
                  }
                >
                  {/* Hover Accent */}
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover/card:opacity-10 transition-opacity">
                     <Layers size={60} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-black/40 border border-white/10 flex items-center justify-center group-hover/card:bg-white group-hover/card:border-white transition-all duration-500 group-hover/card:shadow-2xl">
                       <item.icon size={32} className={`${item.color} group-hover/card:text-black transition-colors duration-500`} />
                    </div>
                    <div className="text-center space-y-2">
                       <p className="text-[10px] font-black tracking-widest uppercase opacity-40 group-hover/card:opacity-100 transition-opacity">
                         Asset Code: 0{(startIndex + index + 1)}
                       </p>
                       <p className="text-[11px] font-black tracking-[0.2em] uppercase leading-tight min-h-[2.5rem] flex items-center justify-center">
                         {item.label}
                       </p>
                    </div>
                  </div>

                  {/* Progressive Border Animation */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Tactical Navigation */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:block opacity-0 group-hover/slider:opacity-100 transition-all duration-500 -translate-x-4 group-hover/slider:translate-x-0">
             <button
               onClick={prevSlide}
               className="w-16 h-16 flex items-center justify-center bg-white/5 backdrop-blur-2xl text-white rounded-full border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all shadow-2xl active:scale-90"
             >
               <ChevronLeft size={24} />
             </button>
          </div>

          <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden lg:block opacity-0 group-hover/slider:opacity-100 transition-all duration-500 translate-x-4 group-hover/slider:translate-x-0">
             <button
               onClick={nextSlide}
               className="w-16 h-16 flex items-center justify-center bg-white/5 backdrop-blur-2xl text-white rounded-full border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all shadow-2xl active:scale-90"
             >
               <ChevronRight size={24} />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

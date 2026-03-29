"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Activity } from "lucide-react";

// Slide Assets
import slide1 from "@/assets/silder.png";
import slide2 from "@/assets/silder1.png";
import slide3 from "@/assets/silder2.png";
import slide4 from "@/assets/silder3.png";

const slides = [
  {
    image: slide1,
    title: "RUN ON AIR",
    subtitle: "NEUTRAL GRAVITY",
    description: "NEXT GEN FOOTWEAR",
    accent: "text-blue-500",
    button: "EXPLORE COLLECTION",
  },
  {
    image: slide2,
    title: "STAY CONNECTED",
    subtitle: "ECOSYSTEM LINK",
    description: "LUXURY SMARTWATCHES",
    accent: "text-purple-500",
    button: "VIEW CATALOG",
  },
  {
    image: slide3,
    title: "PURE SONICS",
    subtitle: "AURAL PERFECTION",
    description: "ELITE AUDIO GEAR",
    accent: "text-emerald-500",
    button: "DISCOVER TECH",
  },
  {
    image: slide4,
    title: "URBAN UTILITY",
    subtitle: "MODERN MOBILITY",
    description: "PREMIUM CARRY SYSTEMS",
    accent: "text-amber-500",
    button: "SHOP LIFESTYLE",
  },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 seconds per slide for better reading
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[85vh] md:h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Hero Image with Ken Burns effect */}
          <motion.div
            initial={{ scale: 1.1, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 8, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              priority
              className="object-cover opacity-70"
            />
          </motion.div>

          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)] opacity-40 z-10" />

          {/* Slide Content */}
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-32 max-w-7xl mx-auto z-20">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-16 h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              <span className="text-xs md:text-sm font-black uppercase tracking-[0.5em] text-blue-400">
                {slides[current].subtitle}
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter leading-[0.85] uppercase"
            >
              {slides[current].description.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? slides[current].accent : "text-white"}>
                  {word}<br className="md:hidden" />
                  {' '}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="text-lg md:text-xl text-gray-400 mb-12 max-w-xl font-medium leading-relaxed"
            >
              {slides[current].title}. <span className="text-white">Rushcart Prime Series.</span> Engineered for high-performance retail and extreme lifestyle integration.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="flex flex-wrap gap-6 items-center"
            >
              <button
                onClick={() => router.push("/category")}
                className="group relative flex items-center gap-5 px-8 py-4 bg-white text-black font-black rounded-full overflow-hidden transition-all hover:pr-10 shadow-2xl hover:shadow-blue-500/20 active:scale-95"
              >
                <span className="tracking-[0.2em] uppercase text-[10px]">Initialize Discovery</span>
                <div className="w-9 h-9 flex items-center justify-center bg-black text-white rounded-full transition-all group-hover:rotate-[-45deg] group-hover:bg-blue-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
              
              <div className="hidden md:flex items-center gap-4">
                 <button onClick={prevSlide} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ChevronLeft className="text-white" />
                 </button>
                 <button onClick={nextSlide} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ChevronRight className="text-white" />
                 </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Indicators & Progress */}
      <div className="absolute bottom-16 left-6 md:left-32 flex items-center gap-16 z-30">
        <div className="flex gap-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className="group py-4 relative"
            >
              <div className={`h-[2px] transition-all duration-700 rounded-full shadow-lg ${
                index === current ? "w-24 bg-blue-500 shadow-blue-500/50" : "w-10 bg-gray-800 group-hover:bg-gray-600"
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Atmospheric Scanning Bar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 right-10 md:right-32 h-[300px] w-px bg-gradient-to-b from-blue-500/50 to-transparent z-20"
      >
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 flex items-center gap-4 rotate-90">
           <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/50 whitespace-nowrap">System_Live</span>
        </div>
      </motion.div>
    </div>
  );
}

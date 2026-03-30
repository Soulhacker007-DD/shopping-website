"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IUser } from "@/models/user.model";
import { motion, AnimatePresence } from "framer-motion";
import useGetAllVendorData from "@/hooks/useGetAllVendorData";
import { MapPin, ShieldCheck, ShoppingBag, ArrowRight, Zap, Target } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function ShopsPage() {
  const router = useRouter();
  useGetAllVendorData();

  const allVendorData: IUser[] = useSelector(
    (state: RootState) => state.vendor.allVendorData
  );

  if (!allVendorData || allVendorData.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white bg-transparent gap-8">
        <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-gray-800 shadow-2xl">
           <ShoppingBag size={40} className="animate-pulse" />
        </div>
        <div className="text-center space-y-2">
           <h3 className="text-3xl font-black uppercase tracking-tighter">Terminals Offline</h3>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">No active vendor nodes detected in the sector.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="w-full bg-transparent px-6 py-32 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto mb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-6"
        >
           <div className="w-12 h-px bg-emerald-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">Verified_Sectors</span>
        </motion.div>
        <h2 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
          Trusted<br/><span className="text-emerald-500">Storefronts</span>
        </h2>
        <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
          Access verified merchant nodes. All terminals in this sector have cleared multi-layer authentication protocols.
        </p>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {allVendorData.map((vendor, i) => (
            <motion.div
              key={String(vendor._id)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              onClick={() => router.push(`/shop-details/${vendor._id}`)}
              className="group relative bg-[#0a0a0a] backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden cursor-pointer transition-all duration-700 hover:border-emerald-500/40 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.2)]"
            >
              {/* Tactical Viewport (Banner) */}
              <div className="relative w-full aspect-video overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-white/5">
                <Image
                  src={vendor.image || "/shop.png"}
                  alt={vendor.shopName || "Shop"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                
                {/* Visual ID Badge */}
                <div className="absolute top-6 left-6">
                   <div className="w-12 h-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-center text-white/50 group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-all">
                      <Target size={20} />
                   </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${vendor.verificationStatus === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                   <span className="text-[8px] font-black uppercase tracking-widest text-white/80">{vendor.verificationStatus}</span>
                </div>
              </div>

              {/* Data Overlay */}
              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                    {vendor.shopName || "Unknown_Node"}
                  </h3>
                  <div className="flex items-start gap-3 text-gray-600 transition-colors group-hover:text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500/50 group-hover:text-emerald-500" />
                    <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                      {vendor.businessAddress || "Sector Undefined"}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-white/5">
                  <div className="flex flex-col gap-1">
                     <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">Terminal Access</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Initialize_Link</span>
                  </div>
                  
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-xl">
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Scanner Line Animation */}
              <motion.div 
                className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-emerald-500/50 to-transparent z-20 pointer-events-none"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

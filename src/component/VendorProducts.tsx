"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { RootState } from "@/redux/store";
import { setAllProductsData } from "@/redux/vendorSlice";
import useGetAllProductsData from "@/hooks/useGetAllProductsData";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import { 
  Package, 
  Plus, 
  Edit3, 
  Power, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Search
} from "lucide-react";

export default function VendorProducts() {
  const router = useRouter();
  const dispatch = useDispatch();
  useGetAllProductsData();
  useGetCurrentUser();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const { allProductsData } = useSelector((state: RootState) => state.vendor);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const myProducts = useMemo(() => {
    if (!currentUser?._id || !allProductsData?.length) return [];
    return allProductsData.filter((product: any) => {
      const matchVendor = product.vendor === currentUser._id || product.vendor?._id === currentUser._id;
      const matchSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchVendor && matchSearch;
    });
  }, [currentUser, allProductsData, searchQuery]);

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      setLoadingId(productId);
      const res = await axios.post("/api/vendor/active-product", {
        productId,
        isActive: !currentStatus,
      });
      const updatedProducts = allProductsData.map((p: any) => p._id === productId ? res.data.product : p);
      dispatch(setAllProductsData(updatedProducts));
      setLoadingId(null);
    } catch (error: any) {
      setLoadingId(null);
      alert(error?.response?.data?.message || "Status update failed.");
    }
  };

  return (
    <div className="w-full min-h-screen p-6 sm:p-10 bg-black font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Inventory_Registry_V2.6</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase">
            Asset <span className="text-blue-500">Matrix</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Authorized Deployment Management for {currentUser?.name || "Merchant"}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="FILTER ASSETS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black tracking-widest text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all uppercase"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/add-vendor-product")}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] transition-all"
          >
            <Plus size={16} strokeWidth={3} />
            Initialize Asset Manifest
          </motion.button>
        </div>
      </header>

      {/* REGISTRY TABLE */}
      <div className="relative z-10 overflow-hidden bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Asset Identity</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Valuation</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Clearance</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Deployment</th>
                <th className="p-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Authorization</th>
              </tr>
            </thead>
            <tbody>
              {myProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Package size={60} />
                      <p className="text-xs font-black uppercase tracking-widest">No assets found in current matrix</p>
                    </div>
                  </td>
                </tr>
              ) : (
                myProducts.map((product: any, idx: number) => (
                  <motion.tr 
                    key={product._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-5">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-black/40 border border-white/10 group-hover:border-blue-500/30 transition-colors">
                          <Image src={product.image1} alt="" fill className="object-cover" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-white tracking-tight uppercase group-hover:text-blue-400 transition-colors line-clamp-1">{product.title}</p>
                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{product.category}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-white">₹{Number(product.price).toLocaleString()}</p>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">Liquid Asset Value</p>
                      </div>
                    </td>

                    <td className="p-6">
                      <StatusBadge status={product.verificationStatus} />
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.isActive ? "bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-red-500"}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.isActive ? "text-blue-400" : "text-red-500"}`}>
                          {product.isActive ? "Tactical_Live" : "Standby"}
                        </span>
                      </div>
                    </td>

                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => router.push(`/update-product/${product._id}`)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white hover:text-black transition-all"
                          title="Modify Manifest"
                        >
                          <Edit3 size={16} />
                        </button>
                        
                        <button 
                          onClick={() => toggleProductStatus(product._id, product.isActive)}
                          disabled={product.verificationStatus !== "approved" || loadingId === product._id}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                            product.verificationStatus === "approved"
                            ? product.isActive 
                              ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                              : "bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white"
                            : "bg-gray-800 border-white/5 text-gray-600 cursor-not-allowed"
                          }`}
                          title={product.isActive ? "Deactivate Asset" : "Deploy Asset"}
                        >
                          {loadingId === product._id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Power size={16} />
                          )}
                        </button>

                        <button 
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-blue-500 transition-all"
                          title="External Link"
                        >
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REJECTION PROTOCOL LOGS */}
      {myProducts.some((p: any) => p.verificationStatus === "rejected") && (
        <div className="mt-8 p-6 bg-red-500/5 border border-red-500/10 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle size={20} />
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Matrix Rejection Logs</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProducts.filter((p: any) => p.verificationStatus === "rejected").map((p: any) => (
              <div key={p._id} className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                 <p className="text-[10px] font-black text-white uppercase mb-1">{p.title}</p>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">REASON: {p.rejectedReason || "Protocol Violation"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const StatusBadge = ({ status }: { status: string }) => {
  const configs: any = {
    approved: {
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: ShieldCheck,
      label: "Authorized"
    },
    pending: {
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      icon: Clock,
      label: "Verifying"
    },
    rejected: {
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: AlertCircle,
      label: "Denied"
    }
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}>
      <Icon size={12} className={config.color} />
      <span className={`text-[9px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
    </div>
  );
};

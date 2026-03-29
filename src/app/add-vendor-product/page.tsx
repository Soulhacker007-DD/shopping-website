"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  FiUpload, 
  FiPlus, 
  FiTrash2, 
  FiPackage, 
  FiTag, 
  FiDollarSign, 
  FiLayers, 
  FiFileText,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiCreditCard
} from "react-icons/fi";
import { 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const categories = [
  "Fashion & Lifestyle",
  "Electronics & Gadgets",
  "Home & Living",
  "Beauty & Personal Care",
  "Toys, Kids & Baby",
  "Food & Grocery",
  "Sports & Fitness",
  "Automotive Accessories",
  "Gifts & Handcrafts",
  "Books & Stationery",
  "Others",
];

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

export default function AddProduct() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const [isWearable, setIsWearable] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);

  const [replacementDays, setReplacementDays] = useState("");
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [warranty, setWarranty] = useState("");
  const [payOnDelivery, setPayOnDelivery] = useState(false);

  const [detailPoints, setDetailPoints] = useState<string[]>([]);
  const [currentPoint, setCurrentPoint] = useState("");

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [previews, setPreviews] = useState<string[]>(["", "", "", ""]);

  const [loading, setLoading] = useState(false);

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleAddPoint = () => {
    if (!currentPoint.trim()) return;
    setDetailPoints((prev) => [...prev, currentPoint.trim()]);
    setCurrentPoint("");
  };

  const handleRemovePoint = (index: number) => {
    setDetailPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, f: File | null) => {
    if (!f) return;
    const newFiles = [...imageFiles];
    newFiles[index] = f;
    setImageFiles(newFiles);

    const newPreviews = [...previews];
    newPreviews[index] = URL.createObjectURL(f);
    setPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !stock || !category || imageFiles.some(f => !f)) {
      alert("ATTENTION: Mission-Critical parameters or asset images are missing.");
      return;
    }

    if (isWearable && sizes.length === 0) {
      alert("ATTENTION: Configuration manifest requires at least one size for wearables.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category === "Others" ? customCategory : category);
      formData.append("isWearable", String(isWearable));
      sizes.forEach((size) => formData.append("sizes", size));
      formData.append("replacementDays", replacementDays);
      formData.append("freeDelivery", String(freeDelivery));
      formData.append("warranty", warranty);
      formData.append("payOnDelivery", String(payOnDelivery));
      detailPoints.forEach((point) => formData.append("detailsPoints", point));
      
      imageFiles.forEach((file, index) => {
        if (file) formData.append(`image${index + 1}`, file);
      });

      await axios.post("/api/vendor/add-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ MANIFEST ACCEPTPED: Product indexed. Awaiting admin authorization.");
      router.push("/");
    } catch (error: any) {
      console.log("ADD PRODUCT ERROR:", error);
      alert(error?.response?.data?.message || "❌ DEPLOYMENT FAILED: Check terminal logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[1000px] h-[1000px] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Inventory Deployment Terminal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Add New <span className="text-blue-500">Asset</span></h1>
          <p className="max-w-xl mx-auto text-gray-400 text-sm font-medium tracking-tight">Configure and authorize new product manifests for the Rushcart global trade network.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PRIMARY CONFIGURATION */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                <FiPackage className="text-blue-500" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Core Manifest Details</h3>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-all" />
                  <input 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                    placeholder="Product identification Title"
                    value={title} onChange={(e) => setTitle(e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-all" />
                    <input 
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                      placeholder="Pricing Model (INR)" type="number"
                      value={price} onChange={(e) => setPrice(e.target.value)} 
                    />
                  </div>
                  <div className="relative group">
                    <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-all" />
                    <input 
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                      placeholder="Inventory Volume (Stock)" type="number"
                      value={stock} onChange={(e) => setStock(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="relative group">
                  <select 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase text-gray-400 appearance-none"
                    value={category} onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" className="bg-black">Select Deployment Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-black text-white">{cat}</option>
                    ))}
                  </select>
                </div>

                {category === "Others" && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <input className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                      placeholder="Specify Custom Classification"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                  </motion.div>
                )}

                <div className="relative group">
                  <FiFileText className="absolute left-4 top-4 text-gray-600 group-focus-within:text-blue-500 transition-all" />
                  <textarea 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700 min-h-[120px]"
                    placeholder="Comprehensive Asset Description"
                    rows={4} value={description} onChange={(e) => setDescription(e.target.value)} 
                  />
                </div>
              </div>
            </section>

            {/* POLICY & LOGISTICS */}
            <section className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                <FiTruck className="text-blue-500" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Logistics & Policy Manifest</h3>
              </div>

              <div className="space-y-8">
                <div 
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${
                    isWearable ? "bg-blue-500/10 border-blue-500/30" : "bg-white/[0.02] border-white/5 grayscale"
                  }`}
                  onClick={() => setIsWearable(!isWearable)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-colors ${isWearable ? "bg-blue-500 text-white" : "bg-white/5 text-gray-500"}`}>
                      <FiLayers size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Wearable / clothing module</p>
                      <p className="text-[9px] font-medium text-gray-500 uppercase mt-0.5">Enable size configuration manifests</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isWearable ? "bg-blue-500 border-blue-500" : "border-white/10"}`}>
                    {isWearable && <CheckCircle2 size={16} />}
                  </div>
                </div>

                <AnimatePresence>
                  {isWearable && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 ml-2">Authorize Sizes</p>
                      <div className="flex flex-wrap gap-3">
                        {sizeOptions.map((size) => (
                          <button 
                            key={size} type="button" onClick={() => toggleSize(size)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black border transition-all ${
                              sizes.includes(size)
                                ? "bg-blue-500 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                : "bg-white/[0.03] border-white/10 text-gray-500 hover:border-white/20"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <FiRotateCcw className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-all" />
                    <input className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                      placeholder="Replacement Horizon (Days)" type="number"
                      value={replacementDays} onChange={(e) => setReplacementDays(e.target.value)} 
                    />
                  </div>
                  <div className="relative group">
                    <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-all" />
                    <input className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                      placeholder="Warranty Coverage"
                      value={warranty} onChange={(e) => setWarranty(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <label className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-3">
                      <FiTruck className={freeDelivery ? "text-blue-500" : "text-gray-600"} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Free Delivery</span>
                    </div>
                    <input type="checkbox" className="hidden" checked={freeDelivery} onChange={() => setFreeDelivery(!freeDelivery)} />
                    <div className={`w-10 h-5 rounded-full relative transition-all ${freeDelivery ? "bg-blue-600" : "bg-gray-800"}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${freeDelivery ? "left-6" : "left-1"}`} />
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-3">
                      <FiCreditCard className={payOnDelivery ? "text-blue-500" : "text-gray-600"} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Cash on Delivery</span>
                    </div>
                    <input type="checkbox" className="hidden" checked={payOnDelivery} onChange={() => setPayOnDelivery(!payOnDelivery)} />
                    <div className={`w-10 h-5 rounded-full relative transition-all ${payOnDelivery ? "bg-blue-600" : "bg-gray-800"}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${payOnDelivery ? "left-6" : "left-1"}`} />
                    </div>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* SIDEBAR: ASSETS & SPECS */}
          <div className="space-y-8">
            <section className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-6 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <FiUpload className="text-blue-500" size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Visual Assets</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="relative group/img">
                    <input type="file" hidden id={`img${idx}`} accept="image/*"
                      onChange={(e) => handleImageChange(idx, e.target.files?.[0] || null)}
                    />
                    <label htmlFor={`img${idx}`}
                      className="cursor-pointer block aspect-square bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                    >
                      {previews[idx] ? (
                        <Image src={previews[idx]} alt="preview" fill className="object-cover" />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                          <FiPlus size={20} className="group-hover/img:scale-125 transition-transform" />
                          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Asset {idx + 1}</span>
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 mt-4 text-center">Protocol requires 4 high-resolution captures</p>
            </section>

            <section className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-6 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <FiLayers className="text-blue-500" size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Diagnostic Specs</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl p-3 text-[10px] font-black tracking-widest focus:outline-none focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                    placeholder={`Diagnostic Point`}
                    value={currentPoint}
                    onChange={(e) => setCurrentPoint(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddPoint()}
                  />
                  <button
                    type="button"
                    onClick={handleAddPoint}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-500/20"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  {detailPoints.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl group"
                    >
                      <span className="text-[9px] font-black text-gray-400 capitalize">
                        {i + 1}. {point}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(i)}
                        className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </motion.div>
                  ))}
                  {detailPoints.length === 0 && (
                     <div className="text-center py-6 opacity-20 flex flex-col items-center">
                        <AlertCircle size={24} className="mb-2" />
                        <span className="text-[8px] font-black uppercase tracking-widest">No Specs Defined</span>
                     </div>
                  )}
                </div>
              </div>
            </section>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <ClipLoader size={18} color="white" />
              ) : (
                <>
                  Deploy Asset Manifest
                  <CheckCircle2 size={18} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}

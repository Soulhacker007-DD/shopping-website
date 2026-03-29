"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { 
  Star, 
  RotateCcw, 
  Truck, 
  ShieldCheck, 
  Wallet, 
  ShoppingCart, 
  ChevronLeft, 
  MessageSquare,
  Plus,
  Image as ImageIcon,
  User,
  LayoutGrid
} from "lucide-react";
import UserProductCard from "@/component/userProductCard";
import { IProduct } from "@/models/product.model";
import getAllProductsData from "@/hooks/getAllProductsData";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const PolicyBadge = ({ Icon, text, color }: any) => (
  <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-colors">
     <Icon size={24} className={`${color} mb-3 group-hover:scale-110 transition-transform`} />
     <span className="text-[10px] font-black uppercase tracking-widest text-center text-gray-500 group-hover:text-white transition-colors">{text}</span>
  </div>
);

export default function ProductViewPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  
  getAllProductsData();
  
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState <string | null>(null);

  const { allProductsData } = useSelector((state: RootState) => state.vendor);

  const product = useMemo(() => 
    allProductsData?.find((p: IProduct) => String(p._id) === String(id)),
    [allProductsData, id]
  );

  if (!allProductsData || allProductsData.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking_widest text-gray-500">Syncing Catalog...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
          <LayoutGrid className="text-rose-500" size={32} />
        </div>
        <h1 className="text-3xl font-black tracking-tighter">Product Exhausted</h1>
        <button onClick={() => router.push("/category")} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-2xl">Return to Fleet</button>
      </div>
    );
  }

  const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);
  const totalReviews = product.reviews?.length ?? 0;
  const avgRating = totalReviews > 0 ? (product.reviews!.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews).toFixed(1) : "0";
  const relatedProducts = allProductsData?.filter(p => p?.category === product?.category && p?._id !== product?._id) || [];

  const handleAddToCart = async () => {
    if (product.isWearable && product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Operational Requirement: Select a size variant before proceeding.");
      return;
    }
    try {
      const res = await axios.post("/api/cart/add", { 
        productId: product._id, 
        quantity: 1,
        size: selectedSize 
      });
      if (res.status === 200) alert("✅ Mission Accomplished: Item Added to Arsenal");
      router.push("/cart");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Operation Failed ❌");
    }
  };

  const submitReview = async () => {
    if (!reviewRating || !reviewComment) {
      alert("Intelligence data required: Rating and Feedback cannot be empty");
      return;
    }
    try {
      setSubmittingReview(true);
      const formData = new FormData();
      formData.append("productId", String(product._id));
      formData.append("rating", String(reviewRating));
      formData.append("comment", reviewComment);
      if (reviewImage) formData.append("image", reviewImage);
      await axios.post("/api/product/add-review", formData);
      alert("✅ Transmission Successful: Review Logged");
      router.refresh();
      setReviewRating(0);
      setReviewComment("");
      setReviewImage(null);
      setPreview(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Transmission Interrupted");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-28 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors mb-12"
        >
          <ChevronLeft size={16} /> Back to Fleet
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* IMAGE ARCHITECTURE */}
          <div className="space-y-6">
            <motion.div 
              layoutId={`img-${product._id}`}
              className="relative aspect-square bg-[#0a0a0a] rounded-[3rem] border border-white/10 overflow-hidden group p-12"
            >
              <div className="absolute inset-0 bg-radial-at-t from-white/5 to-transparent pointer-events-none" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="relative w-full h-full"
                >
                  <Image src={images[activeImage]} alt={product.title} fill className="object-contain" priority />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="flex gap-4 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-24 h-24 rounded-3xl border transition-all overflow-hidden p-2 ${
                    activeImage === i ? "bg-white/10 border-blue-500 scale-110 shadow-lg shadow-blue-500/20" : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT INTELLIGENCE */}
          <div className="space-y-10">
            <header className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 bg-blue-500/10 px-4 py-1.5 rounded-full">{product.category}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight">{product.title}</h1>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-black text-white">{avgRating}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{totalReviews} Reports</span>
                 </div>
                 <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl ${product.stock > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                    {product.stock > 0 ? `Ready for Deployment: ${product.stock} Units` : "Inventory Exhausted"}
                 </div>
              </div>
            </header>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl">
               <div className="mb-6 pb-6 border-b border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Acquisition Price</p>
                  <p className="text-5xl font-black tracking-tighter text-emerald-400">₹ {product.price}</p>
               </div>
               
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                 {product.description}
               </p>

               {/* SIZE VARIANT SELECTION */}
               {product.isWearable && product.sizes && product.sizes.length > 0 && (
                 <div className="mb-8 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Physical Dimensions (Size)</p>
                    <div className="flex flex-wrap gap-3">
                       {product.sizes.map((s: string) => (
                         <button
                           key={s}
                           onClick={() => setSelectedSize(s)}
                           className={`min-w-[60px] h-[60px] flex items-center justify-center rounded-2xl border text-sm font-black uppercase transition-all ${
                             selectedSize === s 
                             ? "bg-white text-black border-white shadow-lg shadow-white/20 scale-105" 
                             : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                           }`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               <div className="space-y-4">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-4 py-6 bg-blue-600 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-2xl shadow-blue-500/20 active:scale-95 group"
                  >
                    <ShoppingCart size={20} className="group-hover:translate-x-1 transition-transform" />
                    Initialize Purchase
                  </button>
                  <button 
                    onClick={() => router.push(`/support?vendorId=${product.vendor?._id || product.vendor}`)}
                    className="w-full flex items-center justify-center gap-4 py-5 bg-white/5 border border-white/10 rounded-4xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/10 group"
                  >
                    <MessageSquare size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    Initiate Secure Transmission
                  </button>
               </div>
            </div>

            {/* Logistics & Security */}
            <div className="grid grid-cols-2 gap-4">
               <PolicyBadge Icon={RotateCcw} text={`${product.replacementDays || 7} Day Return`} color="text-amber-400" />
               <PolicyBadge Icon={Truck} text={product.freeDelivery ? "Free Transport" : "Standard Delivery"} color="text-blue-400" />
               <PolicyBadge Icon={Wallet} text={product.payOnDelivery ? "Post-Pay Active" : "Pre-Pay Only"} color="text-purple-400" />
               <PolicyBadge Icon={ShieldCheck} text={`Warranty: ${product.warranty || "No"} Year`} color="text-emerald-400" />
            </div>

            {/* Highlights */}
            {product.detailsPoints && product.detailsPoints?.length > 0 && (
               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Core Specifications</h3>
                  <div className="grid grid-cols-1 gap-3">
                     {product.detailsPoints.map((p, i) => (
                       <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <p className="text-sm font-bold text-gray-300">{p}</p>
                       </div>
                     ))}
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* RELATED ASSETS */}
        {relatedProducts.length > 0 && (
          <section className="mt-40">
            <header className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-3xl font-black tracking-tight">Similar <span className="text-blue-500">Assets</span></h2>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mt-2">Extended Inventory Synchronized</p>
               </div>
               <button onClick={() => router.push("/category")} className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-colors">View All</button>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {relatedProducts.slice(0, 4).map((rp) => (
                 <UserProductCard key={String(rp._id)} product={rp} />
               ))}
            </div>
          </section>
        )}

        {/* COMMAND FEEDBACK SYSTEM (REVIEWS) */}
        <section className="mt-40 border-t border-white/10 pt-20">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
              
              {/* Feedback Terminal */}
              <div className="lg:col-span-1 space-y-10">
                 <div>
                   <h2 className="text-3xl font-black tracking-tight mb-2">Ecosystem <span className="text-purple-500">Feedback</span></h2>
                   <p className="text-xs font-black uppercase tracking-widest text-gray-500 line-clamp-2">Contribute your intelligence to the community database.</p>
                 </div>

                 <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 px-2">Performance Rating</p>
                       <div className="flex gap-3 px-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <button 
                              key={i} 
                              onClick={() => setReviewRating(i)}
                              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                                i <= reviewRating ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "bg-white/5 text-gray-500 hover:bg-white/10"
                              }`}
                            >
                              <Star size={18} fill={i <= reviewRating ? "currentColor" : "none"} />
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <textarea 
                         value={reviewComment}
                         onChange={(e) => setReviewComment(e.target.value)}
                         placeholder="Synthesize your experience..."
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold min-h-[120px] focus:ring-2 ring-purple-500/20 outline-none placeholder:text-gray-600 transition-all"
                       />
                       
                       <div className="flex items-center gap-4">
                          <label className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:bg-white/10 transition-colors">
                            <ImageIcon size={14} />
                            Upload Evidence
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                               const file = e.target.files?.[0];
                               if(file) { setReviewImage(file); setPreview(URL.createObjectURL(file)); }
                            }} />
                          </label>
                          <AnimatePresence>
                             {preview && (
                               <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/20">
                                  <Image src={preview} alt="Preview" fill className="object-cover" />
                               </motion.div>
                             )}
                          </AnimatePresence>
                       </div>

                       <button 
                         onClick={submitReview}
                         disabled={submittingReview}
                         className="w-full flex items-center justify-center gap-2 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                       >
                         {submittingReview ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={16} />}
                         Transmit Intelligence
                       </button>
                    </div>
                 </div>
              </div>

              {/* Verified Logs */}
              <div className="lg:col-span-2 space-y-10">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Verified Intelligence Logs ({totalReviews})</h3>
                 </div>

                 {product.reviews && product.reviews.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {product.reviews.map((r, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:bg-white/[0.08] transition-colors"
                        >
                           <header className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center overflow-hidden">
                                 {typeof r.user === 'object' && r.user.image ? (
                                   <Image src={r.user.image} alt={r.user.name} width={48} height={48} className="object-cover" />
                                 ) : <User size={20} className="text-gray-500" />}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-white">{typeof r.user === 'object' ? r.user.name : "Anonymous"}</p>
                                 <div className="flex gap-1 mt-1 text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill={s <= r.rating ? "currentColor" : "none"} />)}
                                 </div>
                              </div>
                           </header>
                           <p className="text-sm text-gray-400 font-medium leading-relaxed mb-4">"{r.comment}"</p>
                           {r.image && (
                              <div className="relative w-full h-40 bg-black rounded-xl overflow-hidden border border-white/10">
                                <Image src={r.image} alt="Evidence" fill className="object-contain" />
                              </div>
                           )}
                        </motion.div>
                      ))}
                   </div>
                 ) : (
                   <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                      <MessageSquare className="w-10 h-10 text-gray-800 mx-auto mb-4" />
                      <p className="text-sm font-black text-gray-600 uppercase tracking-widest">Awaiting First Transmission</p>
                   </div>
                 )}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard,
  ShoppingBasket,
  Activity,
  Package,
  LogIn
} from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function UserCartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getCart = async () => {
    try {
      const res = await axios.get("/api/cart/get");
      setCart(res.data.cart || []);
    } catch (error) {
      console.log("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const handleRemoveFromCart = async (productId: string) => {
    // Optimistic UI update
    setCart((prev) => prev.filter((i) => i.product._id !== productId));
    try {
      await axios.post("/api/cart/remove", { productId });
    } catch (error) {
      console.error(error);
      getCart(); // Revert on failure
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await axios.post("/api/cart/update", { productId, quantity });
      getCart();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-6">
        <ClipLoader size={40} color="#3b82f6" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Syncing_Acquisitions</span>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 gap-8">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl">
           <ShoppingBasket size={40} className="text-gray-600" />
        </div>
        <div className="text-center">
           <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Acquisition Manifest Empty</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">No active assets detected in staging</p>
        </div>
        <button 
          onClick={() => router.push("/category")}
          className="group flex items-center gap-4 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:pr-12 transition-all shadow-2xl"
        >
          Initialize Logistics
          <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    );
  }

  const totalCartValue = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-[1px] bg-blue-500" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Mission_Ready</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                 Acquisition<br/><span className="text-blue-500">Terminal</span>
              </h1>
           </div>
           <div className="flex items-center gap-8 bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-6 rounded-3xl group hover:border-blue-500/30 transition-all">
              <div className="space-y-1">
                 <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Manifest Total</span>
                 <span className="block text-2xl font-black tracking-tight">₹ {totalCartValue.toLocaleString()}</span>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                 <Activity size={24} />
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-[3rem] border border-white/10 hover:border-white/20 transition-all shadow-xl flex flex-col md:flex-row gap-8 items-center"
                >
                  <div className="relative w-40 h-40 bg-black rounded-[2rem] overflow-hidden border border-white/5 group-hover:border-blue-500/30 transition-all">
                    <Image
                      src={item.product.image1}
                      alt={item.product.title}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                       UN_0{index + 1}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1 block">Active Asset</span>
                      <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase leading-tight max-w-md">
                        {item.product.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                       <div className="flex items-center gap-1 bg-black/40 px-6 py-3 rounded-full border border-white/10 group-hover:border-blue-500/20 transition-all">
                          <button 
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-12 text-center text-sm font-black">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                       </div>
                       <div className="text-xl font-black tracking-tight">₹ {item.product.price.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                       <button
                         onClick={() => router.push(`/checkout/${item.product._id}`)}
                         className="flex items-center gap-3 px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-[9px] rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                       >
                         Procure Item
                         <LogIn size={12} />
                       </button>
                       <button
                         onClick={() => handleRemoveFromCart(item.product._id)}
                         className="flex items-center gap-2 px-6 py-3 bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full border border-white/5 uppercase tracking-[0.2em] text-[9px] font-black"
                       >
                          Decommission
                          <Trash2 size={12} />
                       </button>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end justify-between self-stretch text-right">
                     <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Subtotal</span>
                     <div className="text-2xl font-black text-blue-500 tracking-tighter">
                        ₹ {(item.product.price * item.quantity).toLocaleString()}
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Cart Summary Section */}
          <div className="space-y-8">
             <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 space-y-8">
                <header className="flex items-center gap-4 py-2 border-b border-white/5 mb-8">
                   <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                      <CreditCard size={20} />
                   </div>
                   <h2 className="text-xl font-black uppercase tracking-widest">Order Summary</h2>
                </header>

                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-500">
                      <span>Total Units</span>
                      <span className="text-white">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-500">
                      <span>System Charge</span>
                      <span className="text-emerald-500">FREE</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-500">
                      <span>Logistics Fees</span>
                      <span className="text-emerald-500">FREE</span>
                   </div>
                   <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-end">
                      <span className="text-xs font-black uppercase tracking-widest text-white">Net Manifest Value</span>
                      <span className="text-4xl font-black text-blue-500 tracking-tighter">₹ {totalCartValue.toLocaleString()}</span>
                   </div>
                </div>

                <div className="pt-6">
                   <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-6 leading-relaxed">
                      All acquisitions are processed via <span className="text-white">Rushcart Prime Secure Protocols</span>. Full refund eligibility active.
                   </p>
                   <button 
                     onClick={() => router.push("/checkout/all")}
                     className="w-full group flex items-center justify-center gap-4 py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-[2rem] hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] transition-all active:scale-95"
                   >
                     Initialize Logistics Sync
                     <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-[-45deg] transition-transform">
                        <ArrowRight size={14} />
                     </div>
                   </button>
                </div>
             </div>

             {/* Security Badge */}
             <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center gap-4 group hover:border-blue-500/20 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                   <ShieldCheck size={24} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-white">Secured Manifest</span>
                  <span className="block text-[8px] font-black uppercase tracking-widest text-gray-600">Tier 1 Encryption Active</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

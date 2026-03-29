"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setAllOrderData } from "@/redux/orderSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, 
  User, 
  Package, 
  CreditCard, 
  Activity, 
  ShieldCheck, 
  Clock, 
  XSquare, 
  RotateCcw,
  ChevronRight,
  Database,
  Search,
  Key
} from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function VendorOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { allOrderData } = useSelector((state: RootState) => state.order);
  const { userData } = useSelector((state: RootState) => state.user);

  const [otpModal, setOtpModal] = useState<any>(null);
  const [otpInput, setOtpInput] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/order/allOrder");
        dispatch(setAllOrderData(res.data.orders || res.data || []));
      } catch {
        dispatch(setAllOrderData([]));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [dispatch]);

  const vendorOrders = useMemo(
    () =>
      (allOrderData || []).filter(
        (o: any) =>
          String(o.productVendor?._id || o.productVendor) ===
          String(userData?._id)
      ),
    [allOrderData, userData]
  );

  const updateStatus = async (orderId: string, status: string) => {
    try {
      setLoadingId(orderId);
      await axios.post("/api/order/update-status", { orderId, status });
      dispatch(
        setAllOrderData(
          allOrderData.map((o: any) =>
            o._id === orderId ? { ...o, orderStatus: status } : o
          )
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const verifyAndDeliver = async () => {
    if(!otpInput) return;
    try {
      setLoadingId(otpModal._id);
      await axios.post("/api/order/verify-delivery-otp", {
        orderId: otpModal._id,
        otp: otpInput,
      });
      dispatch(
        setAllOrderData(
          allOrderData.map((o: any) =>
            o._id === otpModal._id ? { ...o, orderStatus: "delivered" } : o
          )
        )
      );
      setOtpModal(null);
      setOtpInput("");
    } catch(err: any) {
      alert(err?.response?.data?.message || "OTP Verification Failed");
    } finally {
      setLoadingId(null);
    }
  };

  const statusOptions = ["pending", "confirmed", "shipped", "delivered"];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'pending': return 'bg-blue-600/10 text-blue-300 border-blue-600/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'returned': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <ClipLoader size={40} color="#3b82f6" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Synchronizing_Manifests</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12">
      
      {/* TACTICAL LOGISTICS HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-l border-blue-500 pl-8">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Logistics_Protocol_Alpha</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Active<br/><span className="text-blue-500">Manifests</span>
            </h1>
         </div>
         <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-8 shadow-2xl">
            <div className="space-y-1">
               <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Fleet Deployment</p>
               <p className="text-2xl font-black text-white italic">{vendorOrders.length} Logs</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
               <Database size={24} />
            </div>
         </div>
      </header>

      {/* ================= TACTICAL MANIFEST TABLE ================= */}
      <div className="hidden lg:block overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Manifest ID</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Consignee</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Payload Array</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Fiscal Node</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center">Protocol Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {vendorOrders.map((order: any, idx) => (
              <motion.tr 
                key={order._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group hover:bg-white/[0.04] transition-colors"
              >
                <td className="p-8">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                         <Activity size={18} />
                      </div>
                      <span className="text-sm font-black text-white tracking-widest uppercase">#{order._id.slice(-8)}</span>
                   </div>
                </td>
                <td className="p-8">
                   <div className="space-y-1">
                      <p className="text-sm font-black text-white uppercase">{order.address?.name}</p>
                      <div className="flex items-center gap-2 text-gray-500">
                         <User size={10} className="text-blue-500/50" />
                         <span className="text-[10px] font-bold tracking-widest leading-none">{order.address?.phone}</span>
                      </div>
                   </div>
                </td>
                <td className="p-8">
                   <div className="space-y-3">
                      {order.products.map((p: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 max-w-xs group-hover:border-blue-500/20 transition-all">
                           <Package size={12} className="text-blue-500 opacity-50" />
                           <span className="text-[10px] font-black uppercase tracking-tight truncate text-gray-300">
                              {p.product?.title} <span className="text-blue-500 ml-1">×{p.quantity}</span>
                           </span>
                        </div>
                      ))}
                   </div>
                </td>
                <td className="p-8">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 w-fit">
                         <CreditCard size={10} className="text-blue-500" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">{order.paymentMethod}</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                         Auth: <span className={order.isPaid ? "text-blue-400" : "text-amber-400"}>{order.isPaid ? "Cleared" : "Awaiting"}</span>
                      </p>
                   </div>
                </td>
                <td className="p-8">
                   <div className="flex flex-col items-center gap-4">
                      {order.orderStatus === "cancelled" || order.orderStatus === "delivered" || order.orderStatus === "returned" ? (
                         <div className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${getStatusStyle(order.orderStatus)}`}>
                            {order.orderStatus}
                         </div>
                      ) : (
                         <div className="relative group/action">
                            <select
                              disabled={loadingId === order._id}
                              value={order.orderStatus}
                              onChange={async (e) => {
                                if (e.target.value === "delivered") {
                                  await axios.post("/api/order/update-status", { orderId: order._id, status: "delivered" }); 
                                  setOtpModal(order);
                                } else {
                                  updateStatus(order._id, e.target.value);
                                }
                              }}
                              className="appearance-none bg-blue-600 text-white border-none rounded-2xl px-8 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 outline-none"
                            >
                              {statusOptions.map((s) => (
                                <option key={s} value={s} className="bg-black text-white">{s}</option>
                              ))}
                            </select>
                            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover/action:translate-x-1 transition-transform" />
                         </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${order.orderStatus === 'delivered' ? 'bg-blue-500' : 'bg-blue-500 animate-pulse'}`} />
                        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Active_Log_Entry</span>
                      </div>
                   </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE MANIFEST BOXES ================= */}
      <div className="lg:hidden space-y-6">
        {vendorOrders.map((order: any, idx) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Manifest_Registry</p>
                 <h3 className="text-xl font-black tracking-widest">#{order._id.slice(-8)}</h3>
              </div>
              <div className={`px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusStyle(order.orderStatus)}`}>
                 {order.orderStatus}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Consignee</p>
                  <p className="text-xs font-black uppercase truncate">{order.address?.name}</p>
               </div>
               <div className="space-y-1 text-right">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Total Fiscal</p>
                  <p className="text-xs font-black text-blue-400 italic">₹{order.totalAmount}</p>
               </div>
            </div>

            <div className="space-y-3">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Payload Array</p>
              {order.products.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-black/40 border border-white/5 p-4 rounded-2xl">
                   <Package size={14} className="text-blue-500" />
                   <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-tight text-white truncate">{p.product?.title}</p>
                      <p className="text-[8px] font-bold text-gray-500 tracking-widest">Qty: {p.quantity}</p>
                   </div>
                </div>
              ))}
            </div>

            {!(["cancelled", "delivered", "returned"].includes(order.orderStatus)) && (
              <div className="relative">
                <select
                  disabled={loadingId === order._id}
                  value={order.orderStatus}
                  onChange={async (e) => {
                    if (e.target.value === "delivered") {
                      await axios.post("/api/order/update-status", { orderId: order._id, status: "delivered" }); 
                      setOtpModal(order);
                    } else {
                      updateStatus(order._id, e.target.value);
                    }
                  }}
                  className="w-full bg-blue-600 text-white rounded-2xl px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] appearance-none"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s} className="bg-black">{s}</option>
                  ))}
                </select>
                <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ================= FINAL AUTHORIZATION MODAL (OTP) ================= */}
      <AnimatePresence>
        {otpModal && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 z-[200]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-12 rounded-[4rem] w-full max-w-xl space-y-10 shadow-[0_60px_100px_-30px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
               
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-[2rem] border border-blue-500/20 flex items-center justify-center mx-auto shadow-2xl">
                     <ShieldCheck size={40} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Final Authorization</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-2">Delivery Verification Required for #{otpModal._id.slice(-8)}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="relative group">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity">
                        <Key size={18} />
                     </div>
                     <input
                       type="text"
                       value={otpInput}
                       onChange={(e) => setOtpInput(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 pl-16 pr-6 py-6 rounded-3xl text-sm font-black tracking-[1em] text-blue-500 outline-none focus:border-blue-500/50 transition-all text-center placeholder:tracking-normal placeholder:font-bold placeholder:text-gray-700"
                       placeholder="Enter Security OTP"
                     />
                  </div>
                  
                  <button
                    onClick={verifyAndDeliver}
                    disabled={loadingId === otpModal._id || !otpInput}
                    className="w-full bg-blue-600 py-6 rounded-[2.5rem] flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-blue-500 shadow-2xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {loadingId === otpModal._id ? <ClipLoader size={16} color="white" /> : <><Truck size={18} /> Execute Delivery</>}
                  </button>
                  <button onClick={() => setOtpModal(null)} className="w-full text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">Abort Procedure</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

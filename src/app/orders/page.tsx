"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllOrderData } from "@/redux/orderSlice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Truck, 
  ChevronRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CreditCard, 
  ShoppingBag,
  Info,
  X,
  CheckCircle2,
  Undo2,
  Ban
} from "lucide-react";

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { userData } = useSelector((state: RootState) => state.user);
  const { allOrderData } = useSelector((state: RootState) => state.order);

  const [loading, setLoading] = useState(true);
  const [localOrders, setLocalOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackOrderModal, setTrackOrderModal] = useState<any | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const result = await axios.get("/api/order/allOrder");
        const orders = Array.isArray(result.data)
          ? result.data
          : result.data.orders || [];

        dispatch(setAllOrderData(orders));
      } catch (err) {
        console.log("Order Fetch Error:", err);
        dispatch(setAllOrderData([]));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    setLocalOrders(allOrderData || []);
  }, [allOrderData]);

  const userOrders = useMemo(() => {
    if (!userData) return [];
    return localOrders.filter((o) => {
      const buyerId = o?.buyer?._id ?? o.buyer;
      return String(buyerId) === String(userData._id);
    });
  }, [localOrders, userData]);

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isReturnEligible = (deliveryDate: string, replacementDays: number) => {
    if (!deliveryDate || !replacementDays) return false;
    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;
    return Date.now() <= expiry;
  };

  const getRemainingReturnDays = (deliveryDate: string, replacementDays: number) => {
    if (!deliveryDate || !replacementDays) return 0;
    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;
    const diff = expiry - Date.now();
    return diff <= 0 ? 0 : Math.ceil(diff / (24 * 60 * 60 * 1000));
  };

  const handleReturnOrder = async (orderId: string) => {
    try {
      const res = await axios.post("/api/order/return", { orderId });
      const returnedOrder = res.data.order;
      const updatedOrders = localOrders.map((o: any) =>
        o._id === orderId
          ? { ...o, orderStatus: "returned", returnedAmount: returnedOrder.returnedAmount }
          : o
      );
      alert(`Order Returned. Refund ₹${returnedOrder.returnedAmount}`);
      setSelectedOrder(null);
      setLocalOrders(updatedOrders);
      dispatch(setAllOrderData(updatedOrders));
    } catch (error: any) {
      alert(error?.response?.data?.message || "Return failed");
    }
  };

  const statuses = ["pending", "confirmed", "shipped", "delivered", "returned"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-emerald-400 bg-emerald-500/10";
      case "shipped": return "text-blue-400 bg-blue-500/10";
      case "pending": return "text-amber-400 bg-amber-500/10";
      case "cancelled": return "text-rose-400 bg-rose-500/10";
      case "returned": return "text-purple-400 bg-purple-500/10";
      default: return "text-gray-400 bg-white/5";
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.post("/api/order/cancel", { orderId });
      const updatedOrders = localOrders.map((o: any) =>
        o._id === orderId ? { ...o, orderStatus: "cancelled" } : o
      );
      alert("Order Cancelled Successfully");
      setSelectedOrder(null);
      setLocalOrders(updatedOrders);
      dispatch(setAllOrderData(updatedOrders));
    } catch (error: any) {
      alert(error?.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-500/20" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Syncing Ecosystem Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-28 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">My <span className="text-blue-500">Orders</span></h1>
            </div>
            <p className="text-gray-400 font-medium">Track and manage your premium acquisitions and ecosystem deliveries.</p>
          </motion.div>
          <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-2xl text-sm font-black uppercase tracking-widest text-gray-400">
            {userOrders.length} Records Found
          </div>
        </header>

        {userOrders.length === 0 ? (
          <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-white/10 shadow-2xl">
            <Package className="w-16 h-16 text-gray-800 mx-auto mb-6" />
            <p className="text-2xl font-bold text-gray-500 mb-2">No active orders found</p>
            <p className="text-sm text-gray-600">Start your journey with a new purchase today.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.07] transition-all hover:shadow-2xl hover:shadow-blue-500/5"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Order Overview */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
                        Order #{String(order._id).slice(-8)}
                      </span>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                         <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current`} />
                         {order.orderStatus}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar size={14} />
                        <span className="font-bold">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock size={14} />
                        <span className="font-bold">{order.paymentMethod.toUpperCase()} — {order.isPaid ? 'Payment Confirmed' : 'Pending Verification'}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Line Items</p>
                      <ul className="space-y-2">
                        {order.products.map((p: any, i: number) => (
                          <li key={i} className="flex items-center justify-between group/item">
                            <span className="text-sm font-bold text-white/90 group-hover/item:text-white transition-colors">
                              {p.product?.title || "Item "+(i+1)} <span className="text-gray-600 font-medium">× {p.quantity}</span>
                            </span>
                            <span className="text-xs font-black text-blue-400">₹ {p.quantity * p.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-8">
                    <div className="mb-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Total Amount</p>
                      <p className="text-4xl font-black tracking-tighter text-emerald-400">₹ {order.totalAmount}</p>
                      <p className="text-xs font-bold text-gray-600 mt-1 uppercase tracking-widest">Inclusive of all services</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all group"
                      >
                        Details
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        disabled={order.orderStatus === "delivered" || order.orderStatus === "cancelled"}
                        onClick={() => setTrackOrderModal(order)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                          order.orderStatus === 'delivered' 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : order.orderStatus === 'cancelled'
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 opacity-50 cursor-not-allowed"
                          : "bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02]"
                        }`}
                      >
                        <Truck size={14} />
                        {order.orderStatus === 'delivered' ? 'Delivered' : 'Track'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <div>
                   <h2 className="text-xl font-black tracking-tight">Intelligence Report</h2>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Order Summary #{String(selectedOrder._id).slice(-8)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                {/* Shipping & Billing info grid */}
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-400">
                        <MapPin size={16} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Delivery Coordinates</p>
                      </div>
                      <div className="text-sm px-4 py-3 bg-white/5 border border-white/10 rounded-2xl leading-relaxed whitespace-pre-wrap">
                        <span className="font-black block mb-1 text-white">{selectedOrder.address.name}</span>
                        {selectedOrder.address.address}, {selectedOrder.address.city}, {selectedOrder.address.state} — {selectedOrder.address.pincode}
                        <div className="flex items-center gap-2 mt-2 text-gray-400">
                          <Phone size={12} /> {selectedOrder.address.phone}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-purple-400">
                        <CreditCard size={16} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Billing Metadata</p>
                      </div>
                      <div className="space-y-2 text-sm px-4 py-3 bg-white/5 border border-white/10 rounded-2xl">
                         <div className="flex justify-between">
                            <span className="text-gray-500">Method</span>
                            <span className="font-bold text-white uppercase">{selectedOrder.paymentMethod}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className={`font-bold ${selectedOrder.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>{selectedOrder.isPaid ? 'Verified' : 'Pending'}</span>
                         </div>
                         <div className="flex justify-between pt-2 border-t border-white/5 mt-2">
                            <span className="text-white font-black">Gross Total</span>
                            <span className="text-emerald-400 font-black">₹ {selectedOrder.totalAmount}</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Return/Cancel Conditions */}
                {selectedOrder.paymentMethod === "stripe" && (
                   <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4">
                      <Info className="text-amber-500 shrink-0" size={20} />
                      <div className="space-y-1">
                        <p className="text-xs font-black text-amber-500 tracking-tight uppercase">Stripe Ecosystem Restriction</p>
                        <p className="text-[11px] text-amber-500/80 leading-relaxed font-bold uppercase tracking-tighter">Cancellation unavailable for digital payments. Returns permitted post-delivery within 7 days.</p>
                      </div>
                   </div>
                )}

                {/* Dynamic Actions */}
                <div className="flex flex-col gap-4">
                   {selectedOrder.orderStatus === 'delivered' ? (
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Post-Delivery Protocol</p>
                        {selectedOrder.products.map((p: any, i: number) => {
                          const replacementDays = p.product?.replacementDays || 7;
                          const eligible = isReturnEligible(selectedOrder.deliveryDate, replacementDays);
                          const remaining = getRemainingReturnDays(selectedOrder.deliveryDate, replacementDays);

                          return (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group">
                               <div className="flex-1">
                                  <p className="text-sm font-black text-white">{p.product?.title}</p>
                                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${eligible ? 'text-amber-400' : 'text-gray-500'}`}>
                                    {eligible ? `Return Windows Active: ${remaining} Phase(s) Left` : 'Protection Window Sealed'}
                                  </p>
                               </div>
                               {eligible && (
                                 <button 
                                   onClick={() => handleReturnOrder(selectedOrder._id)}
                                   className="flex items-center gap-2 px-6 py-2 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                 >
                                    <Undo2 size={14} /> Return
                                 </button>
                               )}
                            </div>
                          )
                        })}
                     </div>
                   ) : (
                     selectedOrder.orderStatus !== 'cancelled' && selectedOrder.orderStatus !== 'returned' && (
                       <button
                         disabled={selectedOrder.paymentMethod === 'stripe' && selectedOrder.isPaid}
                         onClick={() => handleCancelOrder(selectedOrder._id)}
                         className="w-full flex items-center justify-center gap-2 py-5 bg-rose-600/10 border border-rose-600/20 text-rose-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                       >
                         <Ban size={16} /> Destroy Transaction Record
                       </button>
                     )
                   )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TRACKING MODAL */}
      <AnimatePresence>
        {trackOrderModal && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setTrackOrderModal(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 shadow-2xl"
            >
              <header className="mb-10 text-center">
                 <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <Truck size={32} />
                 </div>
                 <h2 className="text-2xl font-black tracking-tight">Real-Time Tracker</h2>
                 <p className="text-xs font-black uppercase tracking-widest text-gray-500 mt-1">Satellite Position Updates</p>
              </header>

              <div className="relative space-y-12 pl-4">
                 <div className="absolute top-2 left-[21px] bottom-2 w-[2px] bg-gradient-to-b from-blue-500/50 via-gray-800 to-gray-800" />
                 
                 {statuses.slice(0, 4).map((status, i) => {
                   const currentIndex = statuses.indexOf(trackOrderModal.orderStatus);
                   const isCompleted = currentIndex >= i;
                   const isCurrent = currentIndex === i;

                   return (
                     <div key={i} className="relative flex items-center gap-6 group">
                        <div className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all ${
                          isCompleted ? 'bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-[#0a0a0a] border-gray-800'
                        }`}>
                          {isCurrent && <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />}
                        </div>
                        <div>
                           <p className={`text-xs font-black uppercase tracking-widest ${isCompleted ? 'text-white' : 'text-gray-600'}`}>{status}</p>
                           {isCurrent && <p className="text-[10px] font-bold text-blue-500 mt-1 underline decoration-blue-500/30 underline-offset-2">Active Protocol</p>}
                        </div>
                     </div>
                   )
                 })}
              </div>

              <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <CheckCircle2 size={14} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Verification Status</p>
                 </div>
                 <p className="text-xs font-bold text-gray-400 leading-relaxed">
                   Currently in <span className="text-white capitalize">{trackOrderModal.orderStatus}</span> stage. Ecosystem logistics confirmed at {formatDate(new Date().toISOString())}.
                 </p>
              </div>

              <button 
                onClick={() => setTrackOrderModal(null)}
                className="w-full mt-8 py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Return to Command Center
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  ShieldCheck, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Activity, 
  Globe, 
  Zap,
  ArrowUpRight,
  Store
} from "lucide-react";
import useGetAllVendorData from "@/hooks/useGetAllVendorData";
import useGetAllOrderData from "@/hooks/useGetAllOrderData";
import { motion } from "framer-motion";
import { IUser } from "@/models/user.model";

export default function AdminDashboardPage() {
  useGetAllVendorData();
  useGetAllOrderData();

  const { allVendorData, allProductsData } = useSelector(
    (state: RootState) => state.vendor
  );
  const { allOrderData } = useSelector(
    (state: RootState) => state.order
  );

  const vendors = (allVendorData || []) as IUser[];
  const pendingVendors = vendors.filter((v) => v.verificationStatus === "pending");
  const pendingProducts = (allProductsData || []).filter((p) => p.verificationStatus === "pending");
  const deliveredOrders = (allOrderData || []).filter((o) => o.orderStatus === "delivered");
  const cancelledOrders = (allOrderData || []).filter((o) => o.orderStatus === "cancelled");
  const returnedOrders = (allOrderData || []).filter((o) => o.orderStatus === "returned");
  const remainingOrders = (allOrderData || []).filter((o) => !["delivered", "cancelled", "returned"].includes(o.orderStatus));

  let totalEarnings = 0;
  deliveredOrders.forEach((o) => { if (o.isPaid) totalEarnings += o.totalAmount; });

  const vendorOrderMap: Record<string, number> = {};
  (allOrderData || []).forEach((o) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vendorName = typeof o.productVendor === "object" && (o.productVendor as any)?.shopName
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (o.productVendor as any).shopName
      : "Unknown";
    const name = String(vendorName);
    vendorOrderMap[name] = (vendorOrderMap[name] || 0) + 1;
  });

  const vendorOrderGraph = Object.keys(vendorOrderMap).map((name) => ({
    vendor: name.length > 12 ? name.slice(0, 10) + "..." : name,
    orders: vendorOrderMap[name],
  }));

  const orderProgress = [
    { name: "Delivered", value: deliveredOrders.length },
    { name: "Pending", value: remainingOrders.length },
    { name: "Cancelled", value: cancelledOrders.length },
    { name: "Returned", value: returnedOrders.length },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6", "#ef4444", "#f97316"];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden p-4 md:p-8">
      {/* Cinematic Background Ambience */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* COMMAND HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-white/5">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-px bg-blue-500" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">System_Synchronized</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                 Command<br/><span className="text-blue-500">Center</span>
              </h1>
           </div>
           
           <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl">
              <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                 <Globe size={32} className="animate-spin-slow" />
              </div>
              <div>
                 <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Global Node Status</span>
                 <span className="block text-xl font-black text-emerald-500">OPERATIONAL</span>
              </div>
           </div>
        </header>

        {/* ================= PRIMARY METRICS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox 
             title="Active Vendors" 
             value={vendors.length} 
             Icon={Users} 
             trend={`+${pendingVendors.length} PENDING`} 
             color="blue"
          />
          <StatBox 
             title="Ecosystem Assets" 
             value={allProductsData.length} 
             Icon={Package} 
             trend={`+${pendingProducts.length} PENDING`} 
             color="purple"
          />
          <StatBox 
             title="Total Flow" 
             value={allOrderData.length} 
             Icon={ShoppingCart} 
             trend="LIVE FEED ACTIVE" 
             color="emerald"
          />
          <StatBox 
             title="Net Yield" 
             value={`₹ ${totalEarnings.toLocaleString()}`} 
             Icon={TrendingUp} 
             trend="AUTHORIZED REVENUE" 
             color="amber"
          />
        </div>

        {/* ================= ANALYTICS CLUSTER ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LOGISTICS LOAD (BAR CHART) */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-10 space-y-8">
            <header className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                     <Activity size={20} />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-widest text-white">Vendor Logistics Load</h2>
               </div>
               <div className="hidden md:flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-500" />
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Unit Orders</span>
                  </div>
               </div>
            </header>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorOrderGraph}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis 
                    dataKey="vendor" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }}
                    height={40}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '15px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="orders" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* STATUS INTEGRITY (PIE CHART) */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-10 space-y-8 flex flex-col justify-between">
            <header className="flex items-center gap-4">
               <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center border border-purple-500/20">
                  <Zap size={20} />
               </div>
               <h2 className="text-xl font-black uppercase tracking-widest text-white">Status Integrity</h2>
            </header>

            <div className="h-[250px] relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderProgress}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {orderProgress.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-4xl font-black text-white">{allOrderData.length}</span>
                 <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Total Logs</span>
              </div>
            </div>

            <div className="space-y-3">
               {orderProgress.map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-blue-500" : i === 1 ? "bg-purple-500" : i === 2 ? "bg-red-500" : "bg-orange-500"}`} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.name}</span>
                    </div>
                    <span className="text-xs font-black">{item.value}</span>
                 </div>
               ))}
            </div>
          </div>

        </div>

        {/* ================= VENDOR TERMINALS ================= */}
        <section className="space-y-8">
           <header className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-500">
                  <Store size={24} />
               </div>
               <h2 className="text-3xl font-black uppercase tracking-tighter">Vendor Logistics Dosiers</h2>
           </header>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {vendors.map((vendor: IUser, index: number) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const vendorOrders = (allOrderData || []).filter((o: any) => String(o.productVendor?._id || o.productVendor) === String(vendor._id));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const vendorEarning = vendorOrders.reduce((acc: number, o: any) => (o.orderStatus === "delivered" && o.isPaid) ? acc + o.totalAmount : acc, 0);

                return (
                  <motion.div
                    key={String(vendor._id)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 hover:border-blue-500/30 transition-all shadow-xl space-y-6"
                  >
                    <div className="flex items-start justify-between">
                       <div className="space-y-1">
                          <h3 className="text-xl font-black uppercase tracking-tight truncate max-w-[180px]">
                            {vendor.shopName}
                          </h3>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                            vendor.verificationStatus === "approved" 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                          }`}>
                            <ShieldCheck size={10} />
                            {vendor.verificationStatus}
                          </div>
                       </div>
                       <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-blue-500 group-hover:text-white transition-all" title="View vendor details">
                          <ArrowUpRight size={18} />
                       </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <MetricMini label="Unit Count" value={(allProductsData || []).filter((p) => String(p.vendor?._id || p.vendor) === String(vendor._id)).length} />
                       <MetricMini label="Log Flow" value={vendorOrders.length} />
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-4">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Asset Yield</span>
                          <span className="text-2xl font-black text-blue-500 tracking-tighter">₹ {vendorEarning.toLocaleString()}</span>
                       </div>
                    </div>
                  </motion.div>
                );
             })}
           </div>
        </section>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

interface StatBoxProps {
  title: string;
  value: string | number;
  Icon: React.ComponentType<{ size: number; className?: string }>;
  trend: string;
  color: "blue" | "purple" | "emerald" | "amber";
}

function StatBox({ title, value, Icon, trend, color }: StatBoxProps) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.1)]",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-[0_20px_40px_-15px_rgba(139,92,246,0.1)]",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)]",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-[0_20px_40px_-15px_rgba(245,158,11,0.1)]"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative group overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         <Icon size={80} />
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colorMap[color]}`}>
        <Icon size={28} />
      </div>
      <div>
        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{title}</span>
        <span className="block text-3xl font-black tracking-tighter text-white">{value}</span>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
         <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">{trend}</span>
      </div>
    </motion.div>
  );
}

function MetricMini({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-1">
      <span className="block text-[8px] font-black uppercase tracking-widest text-gray-600">{label}</span>
      <span className="block text-xl font-black text-white">{value}</span>
    </div>
  );
}

"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Wallet, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  Clock, 
  XCircle, 
  RotateCcw,
  Zap,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { motion } from "framer-motion";

import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import useGetAllOrderData from "@/hooks/useGetAllOrderData";
import useGetAllProductsData from "@/hooks/useGetAllProductsData";

export default function VendorDashboardPage() {
  useGetCurrentUser();
  useGetAllOrderData();
  useGetAllProductsData();

  const { userData } = useSelector((state: RootState) => state.user);
  const { allOrderData } = useSelector((state: RootState) => state.order);
  const { allProductsData } = useSelector((state: RootState) => state.vendor);

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Syncing_Neural_Link</span>
      </div>
    );
  }

  if (userData.role !== "vendor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-rose-500 font-black uppercase tracking-[0.5em]">
        Access_Unauthorized
      </div>
    );
  }

  const vendorOrders = allOrderData.filter(
    (o: any) => String(o.productVendor?._id || o.productVendor) === String(userData._id)
  );

  const vendorProducts = allProductsData.filter(
    (p: any) => String(p.vendor?._id || p.vendor) === String(userData._id)
  );

  const validOrders = vendorOrders.filter(
    (o: any) => o.orderStatus !== "cancelled" && o.orderStatus !== "returned"
  );

  let totalSales = 0;
  const customers = new Set<string>();
  validOrders.forEach((o: any) => {
    totalSales += o.totalAmount;
    customers.add(String(o.buyer?._id || o.buyer));
  });

  const ordersDateMap: Record<string, number> = {};
  validOrders.forEach((o: any) => {
    const d = new Date(o.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' });
    ordersDateMap[d] = (ordersDateMap[d] || 0) + 1;
  });

  const ordersByDate = Object.keys(ordersDateMap).map((d) => ({
    date: d,
    orders: ordersDateMap[d],
  }));

  const productSalesMap: Record<string, number> = {};
  validOrders.forEach((o: any) =>
    o.products.forEach((p: any) => {
      const t = p.product?.title || "Unknown";
      productSalesMap[t] = (productSalesMap[t] || 0) + p.quantity;
    })
  );

  const productSales = Object.keys(productSalesMap).map((t) => ({
    product: t.length > 10 ? t.slice(0, 10) + "..." : t,
    sold: productSalesMap[t],
  }));

  const statusData = [
    { name: "Delivered", value: vendorOrders.filter(o => o.orderStatus === "delivered").length, color: "#3b82f6", icon: ShieldCheck },
    { name: "Pending", value: vendorOrders.filter(o => !["delivered","cancelled","returned"].includes(o.orderStatus)).length, color: "#60a5fa", icon: Clock },
    { name: "Cancelled", value: vendorOrders.filter(o => o.orderStatus === "cancelled").length, color: "#ef4444", icon: XCircle },
    { name: "Returned", value: vendorOrders.filter(o => o.orderStatus === "returned").length, color: "#f59e0b", icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-10 space-y-12 text-white font-sans">
      
      {/* MERCHANT IDENTITY HEADER */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden group shadow-2xl"
      >
         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={120} className="text-blue-500" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">Active_Terminal</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Merchant_ID: {String(userData._id).slice(-6).toUpperCase()}</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
                  {userData.shopName}<br/><span className="text-blue-500 font-light opacity-50">Command_Center</span>
               </h1>
            </div>
            <div className="bg-black/40 border border-white/10 p-6 rounded-3xl flex items-center gap-6">
               <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Connected Endpoint</p>
                  <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{userData.email}</p>
               </div>
               <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center border border-blue-500/30">
                  <Activity size={32} />
               </div>
            </div>
         </div>
      </motion.header>

      {/* CORE METRIC ARRAY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard Icon={Users} title="Global Users" value={customers.size} color="text-blue-500" label="Unique_Identifiers" />
        <StatCard Icon={Package} title="Asset Inventory" value={vendorProducts.length} color="text-purple-500" label="Deployment_Units" />
        <StatCard Icon={ShoppingCart} title="Fulfillment Array" value={vendorOrders.length} color="text-blue-600" label="Active_Manifests" />
        <StatCard Icon={Wallet} title="Revenue Quantum" value={`₹${totalSales.toLocaleString()}`} color="text-indigo-500" label="Liquid_Capital" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* NEURAL STATUS MATRIX (PIE) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="xl:col-span-4 bg-white/5 border border-white/10 rounded-[3rem] p-8 flex flex-col space-y-8 shadow-2xl"
        >
           <header className="flex items-center justify-between">
              <div className="space-y-1">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Manifest Distribution</h3>
                 <p className="text-xl font-black text-white">Order Architecture</p>
              </div>
              <PieChartIcon size={24} className="text-blue-500 opacity-50" />
           </header>

           <div className="h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusData.map((s, index) => (
                      <Cell key={index} fill={s.color} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-black text-white">{vendorOrders.length}</span>
                 <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Total Logs</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              {statusData.map((s) => (
                <div key={s.name} className="flex flex-col gap-2 p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors group">
                   <div className="flex items-center gap-2">
                      <s.icon size={12} style={{ color: s.color }} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">{s.name}</span>
                   </div>
                   <span className="text-xl font-black text-white">{s.value}</span>
                </div>
              ))}
           </div>
        </motion.div>

        {/* TEMPORAL ANALYTICS (BAR + LINE) */}
        <div className="xl:col-span-8 grid grid-cols-1 gap-10">
           
           {/* Order Flow Chart */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="bg-white/5 border border-white/10 rounded-[3rem] p-10 h-[400px] shadow-2xl relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <BarChart3 size={100} />
              </div>
              <header className="mb-8">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Temporal Manifesting</h3>
                 <p className="text-2xl font-black text-white tracking-tighter">Velocity Flow Chart</p>
              </header>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={ordersByDate}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase', color: '#3b82f6' }}
                  />
                  <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
           </motion.div>

           {/* Asset Performance Grid */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="bg-white/5 border border-white/10 rounded-[3rem] p-10 h-[400px] shadow-2xl relative overflow-hidden"
           >
             <header className="mb-8">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Inventory Velocity</h3>
                 <p className="text-2xl font-black text-white tracking-tighter">Asset Liquidation Index</p>
              </header>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={productSales}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} vertical={false} />
                  <XAxis dataKey="product" tick={{ fontSize: 9, fontWeight: 'bold' }} axisLine={false} tickLine={false} height={60} interval={0} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)', radius: 10}}
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase', color: '#3b82f6' }}
                  />
                  <Bar dataKey="sold" fill="#3b82f6" radius={12} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
           </motion.div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ Icon, title, value, color, label }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col gap-6 group hover:border-white/20 transition-all shadow-xl"
    >
       <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-2xl`}>
          <Icon size={24} />
       </div>
       <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{title}</p>
          <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
          <div className="pt-2">
             <span className="text-[8px] font-black uppercase tracking-widest text-blue-500/50 bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10">{label}</span>
          </div>
       </div>
    </motion.div>
  );
}

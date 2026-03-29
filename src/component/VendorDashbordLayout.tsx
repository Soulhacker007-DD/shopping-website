'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Menu, 
  X, 
  Zap,
  LayoutDashboard,
  Box,
  Truck
} from "lucide-react";
import VendorProducts from "./VendorProducts";
import VendorOrdersPage from "./vendorOrder";
import VendorDashboardPage from "./vendorDashboardComponent";

export default function VendorDashbordLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <VendorDashboardPage/>;
      case "products": return <VendorProducts/>;
      case "orders": return <VendorOrdersPage/>;
      default: return <VendorDashboardPage />;
    }
  };

  const menu = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "products", label: "Catalog", Icon: Box },
    { id: "orders", label: "Manifests", Icon: Truck },
  ];

  return (
    <div className="w-full flex min-h-screen bg-[#050505] text-white font-sans">

      {/* ---------------- MOBILE TOP BAR ---------------- */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-black/80 backdrop-blur-xl px-6 py-3.5 flex justify-between items-center z-[100] border-b border-white/5 shadow-2xl">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Zap size={16} className="text-white" />
            </div>
            <h1 className="text-base font-black tracking-tighter uppercase">Merchant <span className="text-blue-500">Node</span></h1>
         </div>
         <button 
           onClick={() => setMenuOpen(!menuOpen)}
           className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg"
         >
           {menuOpen ? <X size={18} /> : <Menu size={18} />}
         </button>
      </div>

      {/* ---------------- SIDEBAR LARGE DEVICES ---------------- */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex flex-col w-72 bg-white/5 border-r border-white/10 p-8 backdrop-blur-3xl sticky top-0 h-screen overflow-y-auto"
      >
        <div className="flex items-center gap-4 mb-20">
           <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Zap size={24} className="text-white" />
           </div>
           <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Rushcart</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mt-1">Merchant Center</p>
           </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all relative group
                  ${activePage === item.id
                    ? "bg-white text-black shadow-2xl scale-[1.02]"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
            >
              <item.Icon size={18} className={activePage === item.id ? "text-blue-600" : "group-hover:scale-110 transition-transform"} />
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              {activePage === item.id && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute -right-1 w-1.5 h-6 bg-blue-500 rounded-full blur-[4px]"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-white/5">
           <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-2 px-1">Network Identity</p>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center border border-blue-500/10">
                    <BarChart3 size={14} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest">v1.2 Active</span>
              </div>
           </div>
        </div>
      </motion.aside>

      {/* ---------------- MOBILE SIDEBAR (SLIDE) ---------------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-[110] p-8 bg-black/95 backdrop-blur-3xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-20">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center">
                     <Zap size={20} className="text-white" />
                  </div>
                  <h1 className="text-xl font-black tracking-tighter uppercase">Merchant</h1>
               </div>
               <button onClick={() => setMenuOpen(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-rose-500">
                 <X size={24} />
               </button>
            </div>

            <nav className="space-y-3">
              {menu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-6 px-8 py-5 rounded-[2rem] transition-all
                    ${activePage === item.id
                      ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30"
                      : "bg-white/5 text-gray-500"
                    }`}
                >
                  <item.Icon size={22} />
                  <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- MAIN COMMAND AREA ---------------- */}
      <main className="flex-1 relative">
         <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
         <motion.div
           key={activePage}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
           className="relative z-10 px-4 py-32 lg:p-20"
         >
           {renderPage()}
         </motion.div>
      </main>

    </div>
  );
}

"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  UserCheck, 
  PackageSearch, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  Activity
} from "lucide-react";

// Components
import VendorRequest from "./vendorRequest";
import VendorDetails from "./VendorDetails";
import ProductRequest from "./ProductRequest";
import AllOrdersPage from "./allOrderAdmin";
import AdminDashboardPage from "./adminDashbordComponent";

export default function AdminDashbordLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <AdminDashboardPage/>;
      case "vendors": return <VendorDetails />;
      case "orders": return <AllOrdersPage />;
      case "vendor-approval": return <VendorRequest />;
      case "product-approval": return <ProductRequest />;
      default: return <AdminDashboardPage/>;
    }
  };

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "vendors", label: "Vendor Details", icon: <Store size={18} /> },
    { id: "orders", label: "User Orders", icon: <ShoppingBag size={18} /> },
    { id: "vendor-approval", label: "Vendor Approval", icon: <UserCheck size={18} /> },
    { id: "product-approval", label: "Product Requests", icon: <PackageSearch size={18} /> },
  ];

  return (
    <div className="w-full flex min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">

      {/* ---------------- MOBILE TOP BAR ---------------- */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-black/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-white/5 z-50">
        <div className="flex items-center gap-2">
           <ShieldCheck className="text-blue-500 w-5 h-5" />
           <span className="text-sm font-black uppercase tracking-tighter">Rush<span className="text-blue-500">cart</span> Control</span>
        </div>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ---------------- SIDEBAR LARGE DEVICES ---------------- */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex flex-col w-80 bg-black border-r border-white/5 p-8 sticky top-0 h-screen overflow-y-auto"
      >
        <div className="mb-12 space-y-1">
           <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
             Command<br/><span className="text-blue-500">Center</span>
           </h1>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Secure Link Active
           </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full group flex items-center justify-between px-6 py-4 rounded-2xl transition-all relative overflow-hidden
                  ${
                    activePage === item.id
                      ? "bg-white text-black"
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <span className={`${activePage === item.id ? "text-blue-600" : "group-hover:text-blue-400"} transition-colors`}>
                  {item.icon}
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {activePage === item.id && (
                 <ChevronRight size={14} className="text-black/20" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
           <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                 <Activity size={14} className="text-blue-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Protocol v4.0</span>
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed font-bold uppercase">
                 Internal Admin Node. Access restricted to authorized personnel.
              </p>
           </div>
        </div>
      </motion.aside>

      {/* ---------------- MOBILE SIDEBAR (SLIDE) ---------------- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 w-[85%] max-w-sm h-full bg-black border-r border-white/10 p-8 z-50 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <h1 className="text-xl font-black uppercase tracking-tighter">Control <span className="text-blue-500">Board</span></h1>
                <button 
                  title="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {menu.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest
                        ${
                          activePage === item.id
                            ? "bg-white text-black"
                            : "text-gray-500 hover:bg-white/5"
                        }`}
                  >
                    <span className={activePage === item.id ? "text-blue-600" : ""}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-auto space-y-4">
                 <div className="w-full h-px bg-white/5" />
                 <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 text-center">
                   © 2026 Rushcart Ecosystem
                 </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ---------------- MAIN AREA ---------------- */}
      <main className="flex-1 relative">
         {/* Background Ambience for Content Area */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
         
         <motion.div
           key={activePage}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
           className="relative z-10 lg:p-12 mt-20 lg:mt-0"
         >
           {renderPage()}
         </motion.div>
      </main>
    </div>
  );
}

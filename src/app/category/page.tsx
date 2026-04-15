"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UserProductCard from "@/component/userProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { 
  LayoutGrid, 
  ShoppingBag, 
  Smartphone, 
  Home, 
  Sparkles, 
  Baby, 
  ShoppingCart, 
  Trophy, 
  Car, 
  Gift, 
  BookOpen,
  Search,
  Store,
  ArrowRight,
  Filter,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  Camera,
  Loader2
} from "lucide-react";
import axios from "axios";

const categoryList = [
  { label: "all", Icon: LayoutGrid, color: "text-blue-500" },
  { label: "Fashion & Lifestyle", Icon: ShoppingBag, color: "text-pink-500" },
  { label: "Electronics & Gadgets", Icon: Smartphone, color: "text-blue-500" },
  { label: "Home & Living", Icon: Home, color: "text-amber-500" },
  { label: "Beauty & Personal Care", Icon: Sparkles, color: "text-purple-500" },
  { label: "Toys, Kids & Baby", Icon: Baby, color: "text-green-500" },
  { label: "Food & Grocery", Icon: ShoppingCart, color: "text-lime-500" },
  { label: "Sports & Fitness", Icon: Trophy, color: "text-orange-500" },
  { label: "Automotive Accessories", Icon: Car, color: "text-slate-500" },
  { label: "Gifts & Handcrafts", Icon: Gift, color: "text-indigo-500" },
  { label: "Books & Stationery", Icon: BookOpen, color: "text-teal-500" },
];

export default function CategoriesPage() {
  const { allVendorData } = useSelector((state: RootState) => state.vendor);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedShop, setSelectedShop] = useState("all");
  const [search, setSearch] = useState("");
  const [shopSearch, setShopSearch] = useState("");

  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [displayProducts, setDisplayProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSearchingImg, setIsSearchingImg] = useState(false);

  const handleImageSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSearchingImg(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post("/api/ai/image-search", formData);
      if (res.status === 200) {
        setSearch(res.data.searchQuery);
        // fetchProducts will trigger automatically because search state changed
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "AI Search failed. Please try again.";
      alert(`AI Search Error: ${errorMsg}`);
    } finally {
      setIsSearchingImg(false);
      if (e.target) e.target.value = "";
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const q = params.get("search");
    if (cat) setSelectedCategory(cat);
    if (q) setSearch(q);
    setIsReady(true);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("query", search);
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setApiProducts(data.products || []);
      setDisplayProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    fetchProducts();
  }, [selectedCategory, search, isReady]);

  useEffect(() => {
    if (selectedShop === "all") {
      setDisplayProducts(apiProducts);
    } else {
      setDisplayProducts(
        apiProducts.filter(
          (p: any) => String(p.vendor?._id) === String(selectedShop)
        )
      );
    }
  }, [selectedShop, apiProducts]);

  const filteredShops = useMemo(() => {
    if (!shopSearch || shopSearch.length < 2) return [];
    return allVendorData.filter((v: any) =>
      v.shopName.toLowerCase().includes(shopSearch.toLowerCase())
    );
  }, [shopSearch, allVendorData]);

  return (
    <div className="min-h-screen bg-[#050505] text-white px-6 py-32 relative overflow-hidden font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-0 right-1/4 w-[900px] h-[900px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20 space-y-4">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-4"
           >
              <div className="w-12 h-px bg-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Asset_Deployment</span>
           </motion.div>
           <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Explore<br/><span className="text-blue-500">Inventory</span>
           </h1>
           <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] pt-4 max-w-xl">
             Access the Global Procurement Grid. Filter by Node Category or Verified Vendor Terminals.
           </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* TACTICAL SIDEBAR */}
          <motion.aside 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-3 space-y-10"
          >
            {/* Search Hub */}
            <div className="relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-0 group-focus-within:opacity-20 transition-opacity blur" />
               <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden focus-within:border-blue-500/50 transition-all">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                     <Search size={18} />
                  </div>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Grid..."
                    className="w-full bg-transparent pl-16 pr-20 py-6 text-sm font-bold text-white outline-none placeholder:text-gray-700 uppercase tracking-widest"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSearch}
                      className="hidden"
                      id="category-image-search"
                    />
                    <label htmlFor="category-image-search" className="cursor-pointer">
                      {isSearchingImg ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      ) : (
                        <Camera className="w-5 h-5 text-gray-500 hover:text-blue-500 transition-colors" />
                      )}
                    </label>
                  </div>
               </div>
            </div>

            {/* Category Node Menu */}
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 space-y-6 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Layers size={80} />
               </div>
               <header className="px-6 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Category Nodes</h3>
                  <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                  </div>
               </header>
               <nav className="space-y-1.5">
                {categoryList.map((cat, i) => (
                  <motion.button
                    key={cat.label}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      setSelectedCategory(cat.label);
                      setSelectedShop("all");
                    }}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all relative overflow-hidden
                      ${selectedCategory === cat.label
                        ? "bg-white text-black shadow-2xl"
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <cat.Icon size={18} className={`${selectedCategory === cat.label ? "text-blue-600" : cat.color} transition-colors`} />
                      <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{cat.label}</span>
                    </div>
                    {selectedCategory === cat.label && <ChevronRight size={14} className="opacity-20" />}
                  </motion.button>
                ))}
               </nav>
            </div>

            {/* Vendor Filter Matrix */}
            <div className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-[3rem]">
               <header className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-2xl flex items-center justify-center">
                     <Store size={20} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">Vendor Hub</h3>
               </header>
               
               <div className="relative group">
                  <input
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    placeholder="Terminal Search..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-purple-500/50 outline-none transition-all placeholder:text-gray-700"
                  />
               </div>

               <AnimatePresence>
                {shopSearch.length >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5"
                  >
                    {filteredShops.length === 0 ? (
                      <p className="p-6 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center italic">No Nodes Detected</p>
                    ) : filteredShops.map((v: any) => (
                      <button
                        key={v._id}
                        onClick={() => {
                          setSelectedShop(v._id);
                          setShopSearch(v.shopName);
                        }}
                        className={`w-full flex items-center justify-between px-6 py-4 transition-all ${
                          selectedShop === v._id ? "bg-purple-600/10 text-white" : "text-gray-500 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="text-[9px] font-black uppercase tracking-widest truncate">{v.shopName}</span>
                        <Zap size={10} className={selectedShop === v._id ? "text-purple-500" : "opacity-0"} />
                      </button>
                    ))}
                  </motion.div>
                )}
               </AnimatePresence>
            </div>
          </motion.aside>

          {/* ASSET GRID */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-40 gap-8"
                >
                  <ClipLoader size={40} color="#3b82f6" />
                  <div className="text-center space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Syncing_Tactical_Grid</p>
                     <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Retrieving Asset Manifests...</p>
                  </div>
                </motion.div>
              ) : displayProducts.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-40 px-10 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 space-y-8"
                >
                  <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-gray-700 shadow-2xl">
                     <Activity size={40} />
                  </div>
                  <div className="text-center space-y-2">
                     <h3 className="text-3xl font-black uppercase tracking-tighter">Inventory Exhausted</h3>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 max-w-xs leading-relaxed">
                        No active assets detected in the selected deployment sector. Try Adjusting search parameters.
                     </p>
                  </div>
                  <button 
                    onClick={() => { setSelectedCategory("all"); setSearch(""); setSelectedShop("all"); setShopSearch(""); }}
                    className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] transition-all"
                  >
                    Reset Logistics Parameters
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10"
                >
                  {displayProducts.map((product: any, idx) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <UserProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
}

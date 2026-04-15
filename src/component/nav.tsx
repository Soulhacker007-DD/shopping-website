"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  Home,
  LayoutGrid,
  Phone,
  Store,
  LogIn,
  LogOut,
  Package,
  ChevronRight,
  Camera,
  Loader2,
  Bot,
  Sparkles,
  Mic,
  MicOff
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/rushcart_logo.png";
import { signOut } from "next-auth/react";
import mongoose from "mongoose";
import axios from "axios";


interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "vendor" | "admin";
  phone?: string;
  shopName?: string;
  businessAddress?: string;
  gstNumber?: string;
  isApproved?: boolean;
  verificationStatus?: "pending" | "approved" | "rejected";
  requestedAt?: Date;
  approvedAt?: Date;
  rejectedReason?: string;
  vendorProducts?: mongoose.Types.ObjectId[];
  orders?: mongoose.Types.ObjectId[];
  cart?: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default function Navbar({ user }: { user: IUser }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
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
        const { searchQuery } = res.data;
        // Navigate to category page with the AI-generated query
        router.push(`/category?search=${encodeURIComponent(searchQuery)}`);
      }
    } catch (err: any) {
      console.error("Image search failed:", err);
      const errorMsg = err.response?.data?.error || "AI was unable to process this image. Please try again.";
      alert(`AI Search Error: ${errorMsg}`);
    } finally {
      setIsSearchingImg(false);
      // Clear input
      if (e.target) e.target.value = "";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const res = await axios.get("/api/cart/get");
      if (res.status === 200) {
        const cart = res.data?.cart || [];
        const totalQty = cart.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        setCartCount(totalQty);
      }
    } catch (err) {
      console.log("Navbar cart fetch error:", err);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "user") {
      fetchCartCount();
    }
  }, [user?.role, fetchCartCount]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-100 transition-all duration-500 ${
      scrolled 
        ? "bg-white/80 dark:bg-black/60 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 py-2.5 shadow-2xl" 
        : "bg-transparent py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity" />
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <Image src={logo} alt="Logo" width={40} height={40} className="rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl" />
            </motion.div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-gray-900 dark:text-white tracking-tighter leading-none">Rush<span className="text-blue-500">cart</span></span>
            <span className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest leading-none mt-1">Premium Retail</span>
          </div>
        </div>

        {/* Desktop Links */}
        {user.role === "user" && (
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-white/5 backdrop-blur-md rounded-full border border-gray-200 dark:border-white/5 p-1">
            <NavItem label="Home" path="/" router={router} />
            <NavItem label="Categories" path="/category" router={router} />
            <NavItem label="Shops" path="/shop" router={router} />
            <NavItem label="Orders" path="/orders" router={router} />
          </div>
        )}

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/5 backdrop-blur-md rounded-full border border-gray-200 dark:border-white/5">
            {user?.role === "user" && (
              <>
                <IconBtn Icon={Search} onClick={() => router.push("/category")} />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSearch}
                    className="hidden"
                    id="nav-image-search"
                  />
                  <label htmlFor="nav-image-search" className="cursor-pointer">
                    <IconWithState Icon={Camera} loading={isSearchingImg} />
                  </label>
                </div>
                <div className="h-4 w-[1px] bg-white/10 mx-1" />
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.dispatchEvent(new CustomEvent('toggle-voice-command'))}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all"
                  title="Voice Protocol"
                >
                  <Mic size={18} />
                </motion.button>
                <IconBtn Icon={Bot} onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-chat'))} />
              </>
            )}
            <IconBtn Icon={Phone} onClick={() => router.push("/support")} />
          </div>



          <div className="relative group/profile">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2 pl-3 pr-1 py-1 bg-gray-100 dark:bg-white/5 backdrop-blur-md rounded-full border border-gray-200 dark:border-white/5 cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-white/10"
            >
              <div className="flex flex-col items-end mr-1">
                <span className="text-[10px] font-black text-gray-900 dark:text-white leading-none capitalize tracking-tight">{user?.name?.split(' ')[0]}</span>
                <span className="text-[8px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest leading-none mt-0.5">{user?.role}</span>
              </div>
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="user"
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-[30px] h-[30px] flex items-center justify-center bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500">
                  <User size={14} />
                </div>
              )}
            </motion.div>
            <AnimatePresence>
              {openMenu && <ProfileDropdown router={router} user={user} close={() => setOpenMenu(false)} />}
            </AnimatePresence>
          </div>

          {user?.role === "user" && <CartBtn router={router} count={cartCount} />}
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center gap-3">
          <CartBtn router={router} count={cartCount} />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && <Sidebar close={() => setSidebarOpen(false)} router={router} user={user} />}
      </AnimatePresence>
    </nav>
  );
}

interface NavItemProps {
  label: string;
  path: string;
  router: ReturnType<typeof useRouter>;
}

const NavItem = ({ label, path, router }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === path;
  return (
    <button 
      onClick={() => router.push(path)} 
      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
        isActive 
          ? "bg-white dark:bg-white text-black dark:text-black shadow-xl" 
          : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {label}
    </button>
  );
};

interface IconBtnProps {
  Icon: React.ComponentType<{ size: number }>;
  onClick: () => void;
}

const IconBtn = ({ Icon, onClick }: IconBtnProps) => (
  <motion.button 
    whileHover={{ scale: 1.1 }} 
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all"
  >
    <Icon size={18} />
  </motion.button>
);

const IconWithState = ({ Icon, loading }: { Icon: any, loading: boolean }) => (
  <motion.div 
    whileHover={{ scale: 1.1 }} 
    whileTap={{ scale: 0.95 }}
    className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all"
  >
    {loading ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <Icon size={18} />}
  </motion.div>
);

interface CartBtnProps {
  router: ReturnType<typeof useRouter>;
  count: number;
}

const CartBtn = ({ router, count }: CartBtnProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => router.push("/cart")}
    className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl text-white shadow-lg shadow-blue-600/20"
  >
    <ShoppingCart size={18} />
    {count > 0 && (
      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-white text-blue-600 text-[9px] font-black rounded-full shadow-lg border-2 border-blue-600">
        {count}
      </span>
    )}
  </motion.button>
);

interface ProfileDropdownProps {
  router: ReturnType<typeof useRouter>;
  user: IUser;
  close: () => void;
}

const ProfileDropdown = ({ router, user, close }: ProfileDropdownProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    className="absolute right-0 mt-4 w-60 bg-black/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden"
  >
    <div className="p-6 border-b border-white/10 bg-white/5">
      <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Authenticated</p>
      <p className="text-sm font-black text-white truncate">{user.name}</p>
      <p className="text-[10px] text-gray-400 truncate mt-1">{user.email}</p>
    </div>
    <div className="p-2">
      <DropdownBtn Icon={User} label="My Profile" onClick={() => router.push("/profile")} close={close} />
      <DropdownBtn Icon={Package} label="Order History" onClick={() => router.push("/orders")} close={close} />
      <div className="h-[1px] bg-white/10 my-2 mx-4" />
      <button
        onClick={() => {
          signOut();
          close();
        }}
        className="flex items-center justify-between w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group"
      >
        <div className="flex items-center gap-3 font-bold text-sm">
          <LogOut size={18} />
          Sign Out
        </div>
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  </motion.div>
);

interface DropdownBtnProps {
  Icon: React.ComponentType<{ size: number }>;
  label: string;
  onClick: () => void;
  close: () => void;
}

const DropdownBtn = ({ Icon, label, onClick, close }: DropdownBtnProps) => (
  <button
    onClick={() => {
      onClick();
      close();
    }}
    className="flex items-center justify-between w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all group"
  >
    <div className="flex items-center gap-3 font-bold text-sm">
      <Icon size={18} />
      {label}
    </div>
    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);

interface SidebarProps {
  close: () => void;
  router: ReturnType<typeof useRouter>;
  user: IUser;
}

const Sidebar = ({ close, router, user }: SidebarProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
    onClick={close}
  >
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-0 right-0 h-full w-[85%] sm:w-[50%] bg-[#0f0f0f] p-8 flex flex-col border-l border-white/10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Logo" width={32} height={32} className="rounded-xl border border-white/10" />
          <span className="text-xl font-black text-white">Menu</span>
        </div>
        <button onClick={close} className="p-2 rounded-xl bg-white/5 text-white" aria-label="Close menu">
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <SidebarLink Icon={Home} label="Home" path="/" router={router} close={close} />
        <SidebarLink Icon={LayoutGrid} label="Categories" path="/category" router={router} close={close} />
        <SidebarLink Icon={Store} label="Browse Shops" path="/shop" router={router} close={close} />
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('toggle-ai-chat'));
            close();
          }}
          className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 font-bold text-sm transition-all text-left"
        >
          <Sparkles size={20} /> Rushcart AI Assistant
        </button>
        
        {user?.role === "user" && (
          <SidebarLink Icon={Package} label="Track Orders" path="/orders" router={router} close={close} />
        )}

        <div className="h-[1px] bg-white/10 my-4" />

        {user?._id ? (
          <>
            <SidebarLink Icon={User} label="My Profile" path="/profile" router={router} close={close} />
            <button
              onClick={() => {
                signOut();
                close();
              }}
              className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-red-500/10 text-red-400 font-bold text-sm transition-all text-left mt-4"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </>
        ) : (
          <SidebarLink Icon={LogIn} label="Sign In" path="/login" router={router} close={close} />
        )}
      </div>

      <div className="mt-auto pt-8 border-t border-white/10">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
          Rushcart Premium Ecosystem
        </p>
      </div>
    </motion.div>
  </motion.div>
);

interface SidebarLinkProps {
  Icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  path: string;
  router: ReturnType<typeof useRouter>;
  close: () => void;
}

const SidebarLink = ({ Icon, label, path, router, close }: SidebarLinkProps) => (
  <button
    onClick={() => {
      router.push(path);
      close();
    }}
    className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all text-left"
  >
    <Icon size={20} className="text-blue-500" /> {label}
  </button>
);

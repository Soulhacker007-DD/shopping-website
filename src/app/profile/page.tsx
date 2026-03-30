"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Store, 
  MapPin, 
  Hash, 
  Edit3, 
  ShoppingBag, 
  Camera,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { setUserData } from "@/redux/userSlice";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";

export default function ProfilePage() {
  const router = useRouter();
  useGetCurrentUser();
  const user = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch<AppDispatch>();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditShop, setShowEditShop] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [shopName, setShopName] = useState(user?.shopName || "");
  const [businessAddress, setBusinessAddress] = useState(user?.businessAddress || "");
  const [gstNumber, setGstNumber] = useState(user?.gstNumber || "");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(user?.image || "");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (profileImage) formData.append("image", profileImage);

    setLoading(true);
    try {
      const result = await axios.post("/api/user/edit-user-profile", formData);
      dispatch(setUserData(result.data));
      setShowEditProfile(false);
      setProfileImage(null);
      alert("✅ Identity Manifest Updated");
    } catch (error) {
      alert("❌ Transmission Failed: Identity Update Aborted");
    } finally {
      setLoading(false);
    }
  };

  const handleEditShopDetails = async () => {
    if (!shopName || !businessAddress || !gstNumber) {
      alert("Operational Requirement: All Shop Parameters Mandatory");
      return;
    }
    setLoading1(true);
    try {
      await axios.post("/api/vendor/verify-again", { shopName, businessAddress, gstNumber });
      alert("✅ Verification Protocol Re-initialized");
      setShowEditShop(false);
      router.push("/");
    } catch (error) {
      alert("❌ Logistics Error: Could not resend verification");
    } finally {
      setLoading1(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Decrypting Profile Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-28 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-12">
           <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Command <span className="text-blue-500">Center</span></h1>
           <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs">Manage your ecosystem identity and shop logistics</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT: IDENTITY CARD */}
          <div className="lg:col-span-1 space-y-6">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center relative overflow-hidden group"
             >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative w-32 h-32 mx-auto mb-6">
                   <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                   <div className="relative w-full h-full rounded-full border-2 border-white/10 overflow-hidden bg-[#0a0a0a]">
                      {previewImage ? (
                        <Image src={previewImage} alt="Profile" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                           <User size={48} />
                        </div>
                      )}
                   </div>
                   <button 
                     onClick={() => setShowEditProfile(true)}
                     className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-4 border-black text-white hover:scale-110 transition-transform"
                   >
                     <Camera size={16} />
                   </button>
                </div>

                <h2 className="text-2xl font-black tracking-tight mb-1">{user.name}</h2>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 w-fit mx-auto px-4 py-1 rounded-full mb-6">
                   <ShieldCheck size={12} />
                   Verified {user.role}
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                   <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                      <Mail size={14} className="text-blue-500" />
                      <span className="truncate">{user.email}</span>
                   </div>
                   <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                      <Phone size={14} className="text-blue-500" />
                      <span>{user.phone || "Not Linked"}</span>
                   </div>
                </div>
             </motion.div>

             <div className="grid grid-cols-1 gap-3">
                {user.role === "user" && (
                   <button 
                     onClick={() => router.push("/orders")}
                     className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
                   >
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                            <ShoppingBag size={20} />
                         </div>
                         <span className="text-sm font-black uppercase tracking-widest">My Orders</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                   </button>
                )}
                {user.role === "vendor" && (
                   <button 
                     onClick={() => setShowEditShop(!showEditShop)}
                     className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
                   >
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
                            <Store size={20} />
                         </div>
                         <span className="text-sm font-black uppercase tracking-widest">Shop Logistics</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-600 group-hover:rotate-90 transition-transform" />
                   </button>
                )}
             </div>
          </div>

          {/* RIGHT: DYNAMIC CONTENT / LOGISTICS */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* Account Summary */}
             {!showEditProfile && !showEditShop && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-3 text-emerald-400">
                           <CheckCircle2 size={18} />
                           <p className="text-[10px] font-black uppercase tracking-widest">Account Status</p>
                        </div>
                        <p className="text-xl font-bold">Operational</p>
                        <p className="text-xs text-gray-500 font-medium">Your account is fully functional and connected to the global shopping grid.</p>
                     </div>
                     <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-3 text-blue-400">
                           <ShieldCheck size={18} />
                           <p className="text-[10px] font-black uppercase tracking-widest">Security Level</p>
                        </div>
                        <p className="text-xl font-bold">Tier 1 Secured</p>
                        <p className="text-xs text-gray-500 font-medium">Standard encryption protocols active. Identity verified via ecosystem credentials.</p>
                     </div>
                  </div>

                  {user.role === "vendor" && (
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                       <header className="flex items-center justify-between">
                          <div>
                             <h3 className="text-xl font-black tracking-tight">Enterprise Identity</h3>
                             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Shop Manifest Data</p>
                          </div>
                          <div className="px-4 py-1 bg-purple-500/10 text-purple-500 rounded-full text-[10px] font-black uppercase tracking-widest">Active Slot</div>
                       </header>
                       <div className="grid md:grid-cols-2 gap-8">
                          <InfoItem Icon={Store} label="Trade Name" value={user.shopName} />
                          <InfoItem Icon={MapPin} label="Deployment Base" value={user.businessAddress} />
                          <InfoItem Icon={Hash} label="GST Identifier" value={user.gstNumber} />
                          <InfoItem Icon={Edit3} label="Last Updated" value="Recent Session" />
                       </div>
                    </div>
                  )}
               </motion.div>
             )}

             {/* EDIT FORMS */}
             <AnimatePresence mode="wait">
                {showEditProfile && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-10"
                  >
                     <header className="flex items-center justify-between">
                        <h3 className="text-2xl font-black tracking-tight">Edit Identity</h3>
                        <button onClick={() => setShowEditProfile(false)} className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white">Abort</button>
                     </header>
                     
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">Manifest Name</p>
                           <input 
                             value={name} onChange={(e) => setName(e.target.value)}
                             className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 ring-blue-500/20 outline-none" 
                           />
                        </div>
                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">Communication Link</p>
                           <input 
                             value={phone} onChange={(e) => setPhone(e.target.value)}
                             className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 ring-blue-500/20 outline-none" 
                           />
                        </div>
                     </div>

                     <button 
                       onClick={handleUpdateProfile}
                       disabled={loading}
                       className="w-full py-5 bg-blue-600 rounded-3xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-2xl shadow-blue-500/20"
                     >
                        {loading ? <ClipLoader size={16} color="white" /> : "Commit Changes"}
                     </button>
                  </motion.div>
                )}

                {showEditShop && user.role === "vendor" && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-10"
                  >
                     <header className="flex items-center justify-between">
                        <h3 className="text-2xl font-black tracking-tight">Logistics Verification</h3>
                        <button onClick={() => setShowEditShop(false)} className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white">Abort</button>
                     </header>
                     
                     <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4">
                        <AlertCircle className="text-amber-500 shrink-0" size={20} />
                        <p className="text-[11px] font-bold text-amber-500 uppercase tracking-tight leading-relaxed">
                          Synchronizing new trade data requires standard re-verification protocol (Expected window: 120-180 Units of Time).
                        </p>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">Trade Hub Name</p>
                           <input 
                             value={shopName} onChange={(e) => setShopName(e.target.value)}
                             className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 ring-purple-500/20 outline-none" 
                           />
                        </div>
                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">Physical Deployment Base</p>
                           <input 
                             value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)}
                             className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 ring-purple-500/20 outline-none" 
                           />
                        </div>
                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">GST Identification</p>
                           <input 
                             value={gstNumber} onChange={(e) => setGstNumber(e.target.value)}
                             className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:ring-2 ring-purple-500/20 outline-none" 
                           />
                        </div>
                     </div>

                     <button 
                       onClick={handleEditShopDetails}
                       disabled={loading1}
                       className="w-full py-5 bg-purple-600 rounded-3xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-2xl shadow-purple-500/20"
                     >
                        {loading1 ? <ClipLoader size={16} color="white" /> : "Initiate Verification Protocol"}
                     </button>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ Icon, label, value }: any) => (
  <div className="space-y-2">
     <div className="flex items-center gap-2 text-gray-500">
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
     </div>
     <p className="text-sm font-bold text-white pl-6">{value || "Unassigned"}</p>
  </div>
);

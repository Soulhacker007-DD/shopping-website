"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Store, 
  ShieldCheck, 
  ChevronRight, 
  Mail, 
  Lock, 
  UserPlus, 
  Eye, 
  EyeOff,
  ArrowLeft 
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"user" | "vendor" | "admin" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    try {
      const result = await axios.post("/api/auth/register", { name, email, password, role });
      console.log(result.data);
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      router.push("/login");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Registration failed. Please verify your data protocols.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* STEP 1: ACCOUNT TYPE SELECTION */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-2xl text-center z-10"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
                Welcome to <span className="text-blue-500">Rushcart</span>
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">
                Select your deployment role in the ecosystem
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: "User", Icon: User, value: "user", desc: "For personal acquisitions", color: "blue" },
                { label: "Vendor", Icon: Store, value: "vendor", desc: "For enterprise trade", color: "purple" },
                { label: "Admin", Icon: ShieldCheck, value: "admin", desc: "System maintenance", color: "emerald" },
              ].map((item) => (
                <motion.div
                  key={item.value}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(item.value as any)}
                  className={`relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all flex flex-col items-center gap-4 group ${
                    role === item.value 
                    ? "bg-white/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${
                    role === item.value ? "bg-blue-500 text-white" : "bg-white/5 text-gray-400 group-hover:text-white"
                  }`}>
                    <item.Icon size={32} />
                  </div>
                  <div>
                    <span className="block text-sm font-black uppercase tracking-widest mb-1">{item.label}</span>
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-tighter group-hover:text-gray-400">{item.desc}</span>
                  </div>
                  {role === item.value && (
                    <motion.div layoutId="check" className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-black">
                       <ChevronRight size={16} className="text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => role && setStep(2)}
              disabled={!role}
              className={`group flex items-center gap-6 px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl ${
                role 
                ? "bg-white text-black hover:pr-14" 
                : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
              }`}
            >
              Proceed to Manifest
              <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                role ? "bg-black text-white group-hover:translate-x-2" : "bg-white/5"
              }`}>
                <ChevronRight size={20} />
              </div>
            </button>
          </motion.div>
        )}

        {/* STEP 2: REGISTRATION FORM */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 shadow-2xl relative z-10"
          >
            <button 
              onClick={() => setStep(1)}
              className="absolute -top-4 -left-4 w-12 h-12 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>

            <header className="text-center mb-10">
               <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                  <UserPlus size={32} />
               </div>
               <h2 className="text-3xl font-black tracking-tight mb-2 uppercase">Create Identity</h2>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Initializing {role} protocol</p>
            </header>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-4">
                 <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="FULL NAME"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                      onChange={(e) => setName(e.target.value)} value={name}
                    />
                 </div>

                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="email"
                      placeholder="EMAIL ADDRESS"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                      onChange={(e) => setEmail(e.target.value)} value={email}
                    />
                 </div>

                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="PASSWORD"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 pr-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                      onChange={(e) => setPassword(e.target.value)} value={password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all active:scale-95 disabled:grayscale"
              >
                {loading ? <ClipLoader size={20} color="white"/> : "Register Now"}
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/5"></div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">or continue with</span>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-4 py-4 bg-white/5 border border-white/10 rounded-2xl transition-all"
              >
                <FcGoogle size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Account</span>
              </motion.button>

              <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-600">
                Member already?{" "}
                <button 
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-blue-500 hover:text-white transition-colors ml-1"
                >
                  Authorize Identity
                </button>
              </p>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

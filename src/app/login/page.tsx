"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck,
  UserPlus,
  ArrowRight
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState<"idle" | "loading" | "success">("idle");
  const router = useRouter();
  const session = useSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (res?.error) {
        alert("Authorization Denied: Invalid Credentials.");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 relative overflow-hidden font-sans">
      {/* Dynamic Atmospheric Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 shadow-2xl z-10"
      >
        <header className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          >
            <ShieldCheck size={40} />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">
            Welcome <span className="text-blue-500">Back</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
            Authorized Login Protocol for Rushcart
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative group">
              <Mail 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" 
                size={18} 
              />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <Lock 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" 
                size={18} 
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 pr-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
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

          <div className="flex justify-end">
             <button 
               type="button" 
               onClick={() => setIsRecoveryOpen(true)}
               className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-400 transition-colors"
             >
                Forgot Login?
             </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full py-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all active:scale-95 disabled:grayscale"
          >
            {loading ? (
              <ClipLoader size={20} color="white" />
            ) : (
              <>
                Initialize Login
                <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest whitespace-nowrap">External Validation</span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          {/* Google Login */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-4 py-4 bg-white/5 border border-white/10 rounded-2xl transition-all shadow-lg"
          >
            <FcGoogle size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Continue with Google</span>
          </motion.button>

          <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-600 mt-6">
            New to the ecosystem?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="text-blue-500 hover:text-white transition-colors ml-1 inline-flex items-center gap-1 group"
            >
              Register Now
              <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </p>
        </form>
      </motion.div>
      
      {/* Tactical Recovery Terminal Overlay */}
      <AnimatePresence>
        {isRecoveryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative"
            >
              <button 
                onClick={() => { setIsRecoveryOpen(false); setRecoveryStatus("idle"); }}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <ArrowRight size={20} className="rotate-[225deg]" />
              </button>

              <header className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                  <Mail size={28} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Identity <span className="text-blue-500">Recovery</span></h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-2">Initializing decryption protocol</p>
              </header>

              {recoveryStatus === "success" ? (
                <div className="text-center space-y-6">
                   <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                      <p className="text-xs font-bold leading-relaxed text-blue-100">
                         Recovery transmission dispatched to <span className="text-white font-black">{recoveryEmail}</span>. Verify link in your local terminal.
                      </p>
                   </div>
                   <button 
                     onClick={() => setIsRecoveryOpen(false)}
                     className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px]"
                   >
                     Close Interface
                   </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="email"
                      placeholder="REGISTERED DISPATCH ADDRESS"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase placeholder:text-gray-700"
                      onChange={(e) => setRecoveryEmail(e.target.value)} value={recoveryEmail}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if(!recoveryEmail) return;
                      setRecoveryStatus("loading");
                      setTimeout(() => setRecoveryStatus("success"), 2000);
                    }}
                    disabled={recoveryStatus === "loading"}
                    className="w-full py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
                  >
                    {recoveryStatus === "loading" ? <ClipLoader size={16} color="white" /> : (
                      <>
                        Initiate Recovery
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

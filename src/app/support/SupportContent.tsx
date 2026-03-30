"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { 
  Send, 
  User, 
  Sparkles, 
  MessageSquare, 
  Search, 
  MoreVertical,
  ShieldCheck,
  Zap,
  Bot
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

interface ChatUser {
  _id: string;
  name: string;
  image?: string;
  role: "user" | "vendor" | "admin";
  shopName?: string;
}

interface Message {
  sender: string;
  text: string;
  createdAt: string;
}

function SupportContent() {
  const { userData } = useSelector((state: RootState) => state.user);
  const myId = String(userData?._id);

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= AI SUGGESTIONS ================= */
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();
  const targetVendorId = searchParams.get("vendorId");

  useEffect(() => {
    axios
      .get("/api/chat/active-users")
      .then((res) => {
        const fetchedUsers = res.data || [];
        setUsers(fetchedUsers);
        
        // If vendorId is in URL, auto-select that user
        if (targetVendorId) {
          const target = fetchedUsers.find((u: { _id: string | number }) => String(u._id) === String(targetVendorId));
          if (target) setActiveUser(target);
        }
        
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [targetVendorId]);

  useEffect(() => {
    if (!activeUser) return;
    axios
      .get(`/api/chat/get?with=${activeUser._id}`)
      .then((res) => setMessages(res.data || []))
      .catch(console.log);
  }, [activeUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchSuggestions = async () => {
    if (!messages.length || !activeUser || !userData?.role) return;
    const lastMessage = messages[messages.length - 1];
    if (String(lastMessage.sender) === String(myId)) return;

    setLoadingSuggestions(true);
    try {
      const res = await axios.post("/api/chat/suggestions", {
        message: lastMessage.text,
        role: userData.role,
        targetRole: activeUser.role,
      });
      setSuggestions(res.data.suggestions || []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !activeUser) return;
    await axios.post("/api/chat/send", {
      receiverId: activeUser._id,
      text,
    });
    setMessages((prev) => [
      ...prev,
      { sender: myId, text, createdAt: new Date().toISOString() },
    ]);
    setText("");
    setSuggestions([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-6">
        <ClipLoader size={40} color="#3b82f6" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Establishing_Node_Connection</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto h-[85vh] grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        
        {/* ================= LEFT PANEL: USER ARRAY ================= */}
        <div className="md:col-span-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
          <header className="p-8 border-b border-white/5 space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-lg">
                   <MessageSquare size={20} />
                </div>
                <h1 className="text-xl font-black uppercase tracking-widest">Support <span className="text-blue-500">Node</span></h1>
             </div>
             <div className="relative group">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Scan connections..."
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:border-blue-500/50 outline-none transition-all"
                />
             </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <AnimatePresence>
              {users.map((u, i) => (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveUser(u)}
                  className={`group flex items-center gap-4 p-5 rounded-3xl cursor-pointer transition-all border
                    ${activeUser?._id === u._id
                      ? "bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                      : "bg-transparent border-transparent hover:bg-white/5 text-gray-400 hover:text-white"
                    }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 group-hover:border-blue-500/30 transition-all">
                      {u.image ? (
                        <Image src={u.image} alt={u.name} width={48} height={48} className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-black/40 flex items-center justify-center text-gray-500">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-black group-hover:border-transparent transition-all" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-black uppercase tracking-widest truncate ${activeUser?._id === u._id ? "text-black" : "text-white group-hover:text-blue-400"}`}>
                      {u.name}
                    </p>
                    <p className={`text-[8px] font-black uppercase tracking-widest truncate mt-0.5 ${activeUser?._id === u._id ? "text-black/60" : "text-gray-600"}`}>
                      {u.role === "admin" ? "Auth Node" : u.shopName || "End User"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ================= RIGHT PANEL: CHAT TERMINAL ================= */}
        <div className="md:col-span-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl">
          
          {!activeUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
               <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl">
                  <Zap size={40} className="text-gray-600 animate-pulse" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Interface Dormant</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 max-w-xs mx-auto leading-relaxed">
                    Select an active communication node to initialize secure manifest exchange.
                  </p>
               </div>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <header className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-3xl overflow-hidden border border-white/10 shadow-xl">
                      {activeUser.image ? (
                        <Image src={activeUser.image} alt={activeUser.name} width={56} height={56} className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-black/40 flex items-center justify-center text-gray-400">
                          <User size={24} />
                        </div>
                      )}
                   </div>
                   <div className="space-y-1">
                      <h2 className="text-xl font-black uppercase tracking-widest leading-none">{activeUser.name}</h2>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                            <ShieldCheck size={10} className="text-blue-500" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-500">Verified Node</span>
                         </div>
                         {activeUser.shopName && (
                           <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{activeUser.shopName} Terminal</span>
                         )}
                      </div>
                   </div>
                </div>
                <div className="flex gap-4">
                   <button title="Search messages" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                      <Search size={18} />
                   </button>
                   <button title="More options" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                      <MoreVertical size={18} />
                   </button>
                </div>
              </header>

              {/* MESSAGES CONSOLE */}
              <div className="flex-1 p-10 space-y-10 overflow-y-auto scrollbar-hide">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => {
                    const isMe = msg.sender === myId;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex items-end gap-5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/10 shadow-lg shrink-0">
                          <Image 
                            src={isMe ? (userData?.image || "") : (activeUser.image || "")} 
                            alt="avatar" 
                            width={40} 
                            height={40} 
                            className="object-cover" 
                          />
                        </div>

                        <div className={`space-y-2 max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                           <div className={`px-8 py-5 text-[13px] font-bold leading-relaxed shadow-xl
                             ${isMe 
                               ? "bg-blue-600 text-white rounded-3xl rounded-br-2xl border border-blue-400/20" 
                               : "bg-white/10 backdrop-blur-xl text-gray-200 rounded-3xl rounded-bl-2xl border border-white/10"
                             }`}
                           >
                             {msg.text}
                           </div>
                           <span className="text-[8px] font-black uppercase tracking-widest text-gray-700 px-4">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              {/* ACTION TERMINAL */}
              <footer className="p-8 border-t border-white/5 bg-black/40 space-y-6">
                
                {/* NEURAL ASSIST SLIDER */}
                <div className="flex items-center gap-4">
                   <button
                     onClick={fetchSuggestions}
                     disabled={loadingSuggestions}
                     className="px-6 py-3 bg-purple-600/10 border border-purple-500/20 rounded-full flex items-center gap-3 group hover:bg-purple-600/20 transition-all disabled:opacity-50"
                   >
                     <Bot size={14} className="text-purple-500" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-purple-400 group-hover:text-purple-300">
                        {loadingSuggestions ? "Establishing Neural Link..." : "Initialize Neural Assist"}
                     </span>
                   </button>

                   <AnimatePresence>
                     {suggestions.length > 0 && (
                       <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-2 flex-wrap"
                       >
                         {suggestions.map((s, i) => (
                           <button
                             key={i}
                             onClick={() => setText(s)}
                             className="text-[9px] font-black uppercase tracking-widest px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-lg"
                           >
                             {s}
                           </button>
                         ))}
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>

                {/* COMMAND INPUT */}
                <div className="relative group">
                   <div className="absolute inset-x-0 inset-y-0 bg-blue-500/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                   <div className="relative flex items-center gap-3 bg-black/60 border border-white/10 p-3 rounded-[2.5rem] focus-within:border-blue-500/50 transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                      <button title="Attach file" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                         <Sparkles size={18} />
                      </button>
                      <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Execute message sequence..."
                        className="flex-1 bg-transparent text-sm font-bold text-white outline-none px-4"
                      />
                      <button
                        onClick={sendMessage}
                        title="Send message"
                        className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-2xl active:scale-90"
                      >
                        <Send size={24} />
                      </button>
                   </div>
                </div>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupportContent;

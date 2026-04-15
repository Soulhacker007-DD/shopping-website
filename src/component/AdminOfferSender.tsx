'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Send, Percent, Tag, Calendar, User, Sparkles } from 'lucide-react';

const AdminOfferSender = () => {
    const [offerData, setOfferData] = useState({
        discount: '20',
        code: 'RUSH20',
        expiry: '2026-12-31',
        message: 'A special something for your next style upgrade.'
    });
    const [isSending, setIsSending] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const generateAICopy = async () => {
        setIsGenerating(true);
        try {
            // Using the existing Chat API for copy generation
            const res = await axios.post('/api/ai/chat', { 
                message: `Generate a short, catchy, professional marketing message for an e-commerce offer: ${offerData.discount}% OFF using code ${offerData.code}. Keep it under 20 words and super high-end for a brand called Rushcart.`,
                userId: 'admin'
            });
            setOfferData(prev => ({ ...prev, message: res.data.response.replace(/["']/g, '').trim() }));
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendBulk = async () => {
        setIsSending(true);
        setStatus("🚀 Preparing automated campaign...");
        try {
            const res = await axios.post('/api/admin/bulk-offers', offerData);
            setStatus(`✅ Success! Sent to ${res.data.count} active users.`);
        } catch (err) {
            console.error(err);
            setStatus("❌ Failed to broadcast offers.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Sparkles className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">AI Marketing Engine</h2>
                    <p className="text-sm text-white/50">Automate personalized offers across Email and SMS</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Side */}
                <div className="space-y-6">
                    <div className="relative group">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Offer Code" 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            value={offerData.code}
                            onChange={(e) => setOfferData({...offerData, code: e.target.value.toUpperCase()})}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="relative flex-1 group">
                            <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" size={20} />
                            <input 
                                type="number" 
                                placeholder="Discount %" 
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                value={offerData.discount}
                                onChange={(e) => setOfferData({...offerData, discount: e.target.value})}
                            />
                        </div>
                        <div className="relative flex-1 group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" size={20} />
                            <input 
                                type="date" 
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                                value={offerData.expiry}
                                onChange={(e) => setOfferData({...offerData, expiry: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <textarea 
                            placeholder="Campaign Message"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pr-12 h-32 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20 text-sm leading-relaxed"
                            value={offerData.message}
                            onChange={(e) => setOfferData({...offerData, message: e.target.value})}
                        />
                        <button 
                            onClick={generateAICopy}
                            disabled={isGenerating}
                            className="absolute right-3 bottom-3 p-2.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white rounded-xl border border-purple-500/20 transition-all active:scale-95 disabled:opacity-30 tooltip"
                            title="Generate copy with Google Gemini AI"
                        >
                            {isGenerating ? <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" /> : <Sparkles size={16} />}
                        </button>
                    </div>

                    <button 
                        onClick={handleSendBulk}
                        disabled={isSending}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-5 rounded-2xl text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                    >
                        {isSending ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={22} />
                                Broadcast Automations
                            </>
                        )}
                    </button>

                    {status && (
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-sm font-medium text-purple-300 bg-purple-500/10 py-2 rounded-lg"
                        >
                            {status}
                        </motion.p>
                    )}
                </div>

                {/* Preview Side */}
                <div className="bg-black/40 rounded-3xl p-6 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent pointer-events-none" />
                    <Mail size={48} className="text-purple-400 mb-6 opacity-30" />
                    <div className="space-y-4 max-w-[280px]">
                        <h4 className="text-xl font-bold text-white">Live Email Preview</h4>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left scale-90">
                            <p className="text-[10px] text-purple-400 uppercase font-bold mb-1">Subject</p>
                            <p className="text-xs text-white mb-3 font-semibold">Exclusive {offerData.discount}% OFF just for you! 🎁</p>
                            <div className="h-2 w-full bg-white/10 rounded-full mb-1" />
                            <div className="h-2 w-1/2 bg-white/10 rounded-full mb-4" />
                            <div className="border-2 dashed border-white/20 p-2 rounded text-center mb-4">
                                <span className="text-sm font-mono tracking-widest">{offerData.code}</span>
                            </div>
                            <div className="h-8 w-full bg-purple-600 rounded-lg" />
                        </div>
                        <p className="text-xs text-white/40 italic">Recipients will also receive a matching SMS update automatically.</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center text-[11px] text-white/30">
                <span className="flex items-center gap-1.5"><User size={12} /> Target: All Registered Customers</span>
                <span className="flex items-center gap-1.5"><Calendar size={12} /> Scheduled: Immediate Broadcast</span>
            </div>
        </div>
    );
};

export default AdminOfferSender;

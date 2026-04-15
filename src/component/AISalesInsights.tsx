'use client'

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowUpRight, Cpu, Zap, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface AISalesInsightsProps {
    orders: any[];
    products: any[];
}

const AISalesInsights = ({ orders, products }: AISalesInsightsProps) => {
    const [realInsights, setRealInsights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/ai/insights', { orders, products });
            setRealInsights(res.data.insights || []);
        } catch (error) {
            console.error("Failed to fetch AI insights:", error);
            // Non-destructive fallback to basic analysis if API fails
            setRealInsights([
                {
                    type: 'info',
                    title: 'Offline Context',
                    message: 'AI processing is currently on standby. General trend analysis is limited.',
                    action: 'Retry Sync'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orders.length > 0 || products.length > 0) {
            fetchInsights();
        }
    }, [orders.length, products.length]);

    const getIcon = (type: string) => {
        switch(type) {
            case 'success': return TrendingUp;
            case 'warning': return AlertTriangle;
            case 'info': return Lightbulb;
            default: return Zap;
        }
    };

    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative group">
            {/* Neural Background Elements */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-1000">
                <Cpu size={250} className="text-blue-500" />
            </div>
            <div className="absolute bottom-0 left-0 p-12 opacity-[0.02] -translate-x-10 translate-y-10">
                <Zap size={200} className="text-purple-500" />
            </div>

            <header className="mb-10 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit">
                        <Sparkles size={12} className="animate-pulse" />
                        <span>Intelligence Engine Active</span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-white uppercase">Neural <span className="text-blue-500">Sales</span> Insights</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-tight">Deep data synthesis by Google Gemini 1.5</p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchInsights}
                        disabled={loading}
                        className="bg-white/5 border border-white/10 p-2.5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-2xl">
                         <p className="text-[9px] font-black uppercase text-gray-600 tracking-widest leading-none mb-1">Status</p>
                         <p className="text-[10px] font-black text-emerald-400 tracking-tighter uppercase leading-none">Synced with Blockchain Ledger</p>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
                    >
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="bg-black/40 border border-white/5 p-8 rounded-[2rem] h-48 animate-pulse flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5" />
                                    <div className="space-y-2">
                                        <div className="w-2/3 h-3 bg-white/5 rounded-full" />
                                        <div className="w-1/2 h-2 bg-white/5 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        {realInsights.map((insight, idx) => {
                            const Icon: any = getIcon(insight.type);
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ 
                                        delay: idx * 0.1,
                                        type: "spring",
                                        damping: 12,
                                        stiffness: 100
                                    }}
                                    className="bg-black/40 border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between group/card hover:bg-white/5 transition-all hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
                                >
                                    <div className="space-y-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover/card:scale-110 ${
                                            insight.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/5' :
                                            insight.type === 'warning' ? 'bg-rose-500/10 text-rose-500 shadow-rose-500/5' :
                                            'bg-blue-500/10 text-blue-500 shadow-blue-500/5'
                                        }`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-black text-white uppercase text-sm tracking-tight">{insight.title}</h3>
                                            <p className="text-gray-500 text-[11px] leading-relaxed font-black uppercase tracking-tight group-hover/card:text-gray-400 transition-colors">{insight.message}</p>
                                        </div>
                                    </div>
                                    
                                    <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 group-hover/card:text-blue-400 transition-colors bg-white/5 self-start px-3 py-1.5 rounded-full border border-transparent hover:border-blue-500/30">
                                        {insight.action} <ArrowUpRight size={14} className="group-hover/card:translate-x-1 group-hover/card:-translate-y-1 transition-transform" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AISalesInsights;

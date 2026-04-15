'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import UserProductCard from './userProductCard';
import { IProduct } from '@/models/product.model';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RecommendedProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: RootState) => state.user.userData);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get(`/api/ai/recommendations${user?._id ? `?userId=${user._id}` : ''}`);
                setProducts(res.data.products);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user?._id]);

    if (loading) return (
        <div className="w-full py-20 flex justify-center">
            <div className="flex gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
            </div>
        </div>
    );

    if (products.length === 0) return null;

    return (
        <div className="w-full py-10 px-6 sm:px-10 lg:px-20 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-medium text-sm tracking-widest uppercase">
                        <Sparkles size={16} />
                        <span>Curated For You</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                        AI Recommended
                    </h2>
                    <p className="text-gray-400 max-w-md">
                        Our intelligence engine handpicked these deals based on your unique style and preferences.
                    </p>
                </div>
                
                <motion.button 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 text-white font-semibold group border-b border-transparent hover:border-white/20 pb-1 transition-all"
                >
                    View Personalized Catalog <ArrowRight size={18} className="text-blue-500 group-hover:text-white" />
                </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product: any, idx: number) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <UserProductCard product={product} />
                    </motion.div>
                ))}
            </div>
            
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default RecommendedProducts;

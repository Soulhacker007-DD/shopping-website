'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Minus, Maximize2, User, Sparkles, Mic, Volume2, VolumeX } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { usePathname } from 'next/navigation';

interface Message {
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
}

const VoiceWave = () => (
    <div className="flex items-end gap-[2px] h-3 px-1">
        {[1, 2, 3].map(i => (
            <motion.div
                key={i}
                animate={{ height: [4, 12, 4] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-[2px] bg-blue-400 rounded-full"
            />
        ))}
    </div>
);

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isHandsFree, setIsHandsFree] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const scrollRef = useRef<HTMLDivElement>(null);
    const isOpenRef = useRef(isOpen);
    
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);
    
    const languages = [
        { code: 'en-US', name: 'English', flag: '🇺🇸' },
        { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
        { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
        { code: 'de-DE', name: 'German', flag: '🇩🇪' }
    ];
    
    // Get user from Redux
    const user = useSelector((state: RootState) => state.user.userData);
    const userId = user?._id || 'guest';
    const pathname = usePathname();

    const speak = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        // Clean text of markdown characters for natural speech
        const cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
            .replace(/#{1,6}\s/g, '')
            .replace(/[-*+]\s/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = selectedLanguage;
        
        // Find a matching voice if possible
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(selectedLanguage.split('-')[0]));
        if (voice) utterance.voice = voice;

        utterance.rate = 1.1;
        utterance.pitch = 1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            if (isHandsFree) {
                // Auto-listen after replying
                setTimeout(() => toggleListening(), 500);
            }
        };
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening || isSpeaking) return;
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = selectedLanguage;
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            
            // Auto-send upon final transcript for the "Listen + Respond" flow
            if (event.results[0].isFinal) {
                setTimeout(() => {
                    const btn = document.getElementById('chat-send-btn');
                    btn?.click();
                }, 600);
            }
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.start();
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Speak initial greeting when opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = "Hello! I am your Rushcart AI assistant. How can I help you with your shopping today?";
            setTimeout(() => speak(greeting), 500);
        }
    }, [isOpen]);

    // External Trigger Listener
    useEffect(() => {
        const handleToggle = () => {
            const currentOpen = isOpenRef.current;
            setIsOpen(prev => !prev);
            // If we are opening it from external, start listening immediately for the assistant flow
            if (!currentOpen) {
                setTimeout(() => toggleListening(), 800);
            }
        };
        window.addEventListener('toggle-ai-chat', handleToggle);
        return () => window.removeEventListener('toggle-ai-chat', handleToggle);
    }, []); // Keep dependency array stable and empty for global listeners

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axios.post('/api/ai/chat', {
                message: input,
                userId: user?._id, // Passing userId if logged in
                pageContext: pathname
            });

            const botMsg: Message = {
                role: 'model',
                content: res.data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
            speak(res.data.response); // READ RESPONSE
        } catch (error: any) {
            console.error('Chat error:', error);
            const detailMsg = error.response?.data?.details || error.response?.data?.error || "I'm sorry, I'm having trouble connecting right now. Please try again later.";
            
            const errorMsg: Message = {
                role: 'model',
                content: detailMsg,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatMessage = (content: string) => {
        // Simple markdown-ish formatter
        return content.split('\n').map((line, i) => {
            if (line.startsWith('- ')) {
                return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>;
            }
            // Basic bold
            const bolded = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Basic links
            const linked = bolded.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-400 underline">$1</a>');
            return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: linked }} />;
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Bot size={32} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-black" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            height: isMinimized ? '60px' : '500px',
                            width: '380px'
                        }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col transition-all duration-300"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600/80 to-purple-600/80 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Sparkles size={20} className="text-yellow-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Rushcart AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] opacity-80 uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setIsHandsFree(!isHandsFree)}
                                    className={`p-1.5 rounded-lg transition-all ${isHandsFree ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 font-bold text-[10px] flex items-center gap-1 uppercase' : 'hover:bg-white/20 text-white/60'}`}
                                    title="Auto-listen Mode"
                                >
                                    {isHandsFree ? <><Volume2 size={16} /> Live</> : <VolumeX size={18} />}
                                </button>
                                <button 
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages Area */}
                                <div 
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
                                >
                                    {messages.length === 0 && (
                                        <div className="text-center py-10 opacity-60">
                                            <Bot size={48} className="mx-auto mb-4 opacity-20" />
                                            <p className="text-sm">Hello! How can I help you today?</p>
                                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                                {['Shoes under 2000', 'Best deals', 'Order status'].map(chip => (
                                                    <button 
                                                        key={chip}
                                                        onClick={() => {
                                                            setInput(chip);
                                                            setTimeout(() => {
                                                                const btn = document.getElementById('chat-send-btn');
                                                                btn?.click();
                                                            }, 100);
                                                        }}
                                                        className="text-[10px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                                                    >
                                                        "{chip}"
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {messages.map((msg, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                                                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                                                }`}>
                                                    {msg.role === 'user' ? <User size={14} /> : (
                                                        <div className="relative">
                                                            <Bot size={14} />
                                                            {isSpeaking && idx === messages.length - 1 && (
                                                                <div className="absolute -bottom-1 -right-4">
                                                                    <VoiceWave />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`p-3 rounded-2xl text-sm ${
                                                    msg.role === 'user' 
                                                        ? 'bg-blue-600/20 border border-blue-500/30 text-white' 
                                                        : 'bg-white/5 border border-white/10 text-white/90'
                                                }`}>
                                                    {formatMessage(msg.content)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="flex gap-2">
                                                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                                    <Bot size={14} className="text-white" />
                                                </div>
                                                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex gap-1 items-center">
                                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t border-white/10 bg-white/5">
                                    <form 
                                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                        className="relative"
                                    >
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={isListening ? "Listening..." : "Ask Rushcart AI..."}
                                            className={`w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-4 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20 ${isListening ? 'ring-2 ring-red-500/40' : ''}`}
                                        />
                                        <div className="absolute right-2 top-2 flex gap-1.5">
                                            <button
                                                type="button"
                                                onClick={toggleListening}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                                                }`}
                                            >
                                                <Mic size={18} />
                                            </button>
                                            <button
                                                type="submit"
                                                id="chat-send-btn"
                                                disabled={!input.trim() || isLoading}
                                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </form>
                                    <div className="flex items-center justify-between mt-3 px-1">
                                        <div className="flex gap-2">
                                            {languages.map(lang => (
                                                <button
                                                    key={lang.code}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedLanguage(lang.code);
                                                        window.speechSynthesis.cancel();
                                                    }}
                                                    className={`w-6 h-6 flex items-center justify-center rounded-md transition-all text-sm ${
                                                        selectedLanguage === lang.code ? 'bg-blue-500/20 border border-blue-500 scale-110 shadow-sm' : 'opacity-40 hover:opacity-100 hover:scale-105'
                                                    }`}
                                                    title={lang.name}
                                                >
                                                    {lang.flag}
                                                </button>
                                            ))}
                                        </div>
                                        {isSpeaking && (
                                            <button onClick={() => window.speechSynthesis.cancel()} className="text-[9px] text-blue-400 font-bold flex items-center gap-1 uppercase hover:text-red-400 transition-colors">
                                                <VolumeX size={10} /> Stop Voice
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIChatbot;

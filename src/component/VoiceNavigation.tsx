'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Navigation, Search, X, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const VoiceNavigation = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const transcriptRef = useRef('');
    const router = useRouter();

    const speak = useCallback((text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    }, []);

    // Mapping of voice commands to routes/actions
    const commands: Record<string, string | ((query?: string) => void)> = {
        'cart': '/cart',
        'go to cart': '/cart',
        'open cart': '/cart',
        'home': '/',
        'go to home': '/',
        'orders': '/orders',
        'my orders': '/orders',
        'track order': '/orders',
        'profile': '/profile',
        'my profile': '/profile',
        'shop': '/shop',
        'show shops': '/shop',
        'category': '/category',
        'all folders': '/category',
        'folders': '/category',
        'electronics': '/category?search=electronics',
        'show electronics': '/category?search=electronics',
        'fashion': '/category?search=fashion',
        'show fashion': '/category?search=fashion',
        'dashboard': '/shop',
        'inventory': '/shop',
        'back': () => window.history.back(),
        'go back': () => window.history.back(),
        'scroll down': () => window.scrollBy({ top: 500, behavior: 'smooth' }),
        'scroll up': () => window.scrollBy({ top: -500, behavior: 'smooth' }),
        'open chat': () => window.dispatchEvent(new CustomEvent('toggle-ai-chat')),
        'ask ai': () => window.dispatchEvent(new CustomEvent('toggle-ai-chat')),
        'help': () => {
            const msg = "I can navigate to cart, home, profile, or shop. I can also search, scroll, and open the AI assistant.";
            setFeedback(msg);
            speak(msg);
        },
        'search': (query) => router.push(`/category?search=${encodeURIComponent(query || '')}`),
    };

    const processCommand = useCallback((text: string) => {
        const lowerText = text.toLowerCase().trim();
        
        // 1. Direct command match
        for (const [cmd, action] of Object.entries(commands)) {
            if (lowerText.includes(cmd)) {
                const actionName = cmd.replace('go to ', '').replace('show ', '').replace('open ', '');
                const msg = `Acknowledged. Executing ${actionName} protocol.`;
                setFeedback(msg);
                speak(msg);
                
                if (typeof action === 'string') {
                    router.push(action);
                } else if (typeof action === 'function') {
                    if (cmd === 'search') {
                        const searchPart = lowerText.split('search')[1]?.trim();
                        action(searchPart);
                    } else {
                        action();
                    }
                }
                setTimeout(() => setFeedback(null), 3000);
                return true;
            }
        }

        // 2. Fallback search (e.g., "search for shoes")
        if (lowerText.startsWith('search for ')) {
            const query = lowerText.replace('search for ', '');
            const msg = `Initiating scan for ${query}.`;
            setFeedback(msg);
            speak(msg);
            router.push(`/category?search=${encodeURIComponent(query)}`);
            setTimeout(() => setFeedback(null), 3000);
            return true;
        }

        return false;
    }, [router]);

    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }
        if (isListening) return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
            transcriptRef.current = '';
            setFeedback('Awaiting Voice Input...');
            speak("Voice Protocol Active.");
        };

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
            transcriptRef.current = text;
        };

        recognition.onend = () => {
            setIsListening(false);
            const finalTranscript = transcriptRef.current;
            
            if (finalTranscript) {
                const wasCommand = processCommand(finalTranscript);
                if (!wasCommand) {
                    const msg = "Protocol error. Command unrecognized.";
                    setFeedback(msg);
                    speak(msg);
                    setTimeout(() => setFeedback(null), 3000);
                }
            } else {
                setFeedback(null);
            }
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech' || event.error === 'aborted') {
                setIsListening(false);
                setFeedback(null);
                return;
            }
            
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            setFeedback('Error Detected: ' + event.error);
            setTimeout(() => setFeedback(null), 3000);
        };

        recognition.start();
    }, [isListening, processCommand]);

    // External Trigger Listener
    useEffect(() => {
        const handleExternalToggle = () => startListening();
        window.addEventListener('toggle-voice-command', handleExternalToggle);
        return () => window.removeEventListener('toggle-voice-command', handleExternalToggle);
    }, [startListening]);

    return (
        <div className="relative group">
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={startListening}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500 relative overflow-hidden ${
                    isListening 
                        ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] ring-2 ring-red-400/50' 
                        : 'bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-white/20'
                }`}
                title="Voice Protocol"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 pointer-events-none" />
                {isListening ? (
                   <div className="relative">
                      <Mic size={24} />
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-white rounded-full blur-xl"
                      />
                   </div>
                ) : <Mic size={24} className="text-blue-400 group-hover:text-white transition-colors" />}
            </motion.button>

            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        className="absolute bottom-16 left-0 w-72 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[10000]"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 ${isListening ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-500'}`}>
                                <Volume2 size={20} className={isListening ? 'animate-pulse' : ''} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 flex items-center gap-2">
                                   <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`} />
                                   Voice Protocol 4.2
                                </p>
                                <p className="text-xs font-black text-white leading-relaxed truncate">
                                    {isListening ? (
                                        <span className="text-gray-400 italic font-medium">"{transcript || 'Listening...'}"</span>
                                    ) : (
                                        <span className="text-blue-400">{feedback}</span>
                                    )}
                                </p>
                            </div>
                            {!isListening && (
                                <button onClick={() => setFeedback(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        {isListening && (
                            <div className="mt-4 flex items-end gap-[3px] h-6 px-1">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, Math.random() * 20 + 4, 4] }}
                                        transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.05 }}
                                        className="w-1 bg-gradient-to-t from-red-500 to-orange-400 rounded-full"
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VoiceNavigation;

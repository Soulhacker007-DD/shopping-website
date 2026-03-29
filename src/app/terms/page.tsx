"use client";

import { motion } from "framer-motion";
import { FileCheck, ShieldAlert, Scale, Globe, ChevronLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-widest"
        >
          <ChevronLeft size={14} />
          Return to Previous Node
        </button>

        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-4 text-purple-500 mb-6 font-black uppercase text-xs tracking-[0.3em]">
            <Globe size={20} className="text-blue-500" />
            Rushcart Legal Node
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Terms of<br/><span className="text-blue-500 font-black">Service</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 pt-4">
            Directives — Operational Agreement v3.1
          </p>
        </header>

        <div className="space-y-16">
          <Section 
            Icon={FileCheck} 
            title="Ecosystem Directives" 
            content="By entering the Rushcart ecosystem, you agree to abide by all operational directives. Any attempt to disrupt the procurement grid or manipulate vendor logistics will result in immediate node termination."
          />
          <Section 
            Icon={Scale} 
            title="Liability Limitation" 
            content="Rushcart acts as a high-speed logistics mesh between terminal users and vendor nodes. While we verify all primary vendors, ultimate liability for physical unit performance rests with the originating manufacturer node."
          />
          <Section 
            Icon={ShieldAlert} 
            title="Security Compliance" 
            content="Users must maintain secure access credentials for their account terminals. Rushcart is not liable for data breaches resulting from local node security failure or credential leakage."
          />
          <Section 
            Icon={Globe} 
            title="Global Infrastructure" 
            content="These terms are governed by the laws of the Jurisdiction of Operation. All multi-vendor disputes are processed via Rushcart Independent Arbitration Protocols."
          />
        </div>

        <footer className="mt-32 pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            Acceptance confirmed by persistent ecosystem interaction
          </p>
        </footer>
      </div>
    </div>
  );
}

const Section = ({ Icon, title, content }: any) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="space-y-6 group border-l border-white/5 pl-12 hover:border-blue-500/50 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-xl">
        <Icon size={24} />
      </div>
      <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest">{title}</h2>
    </div>
    <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-medium">
      {content}
    </p>
  </motion.section>
);

"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, ChevronLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-widest"
        >
          <ChevronLeft size={14} />
          Return to Previous Node
        </button>

        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-4 text-blue-500 mb-6">
            <Lock size={32} />
            <div className="h-[2px] w-24 bg-blue-500/30" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Privacy<br/><span className="text-blue-500">Protocols</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 pt-4">
            v2.4 — Rushcart Data Governance Policy
          </p>
        </header>

        <div className="space-y-16">
          <Section 
            Icon={Eye} 
            title="Data Collection Terminal" 
            content="Rushcart collects necessary telemetry and identifier data to maintain your ecosystem presence. This includes node identifiers, communication ports, and transaction logs relevant to multi-vendor logistics."
          />
          <Section 
            Icon={Shield} 
            title="Encryption Standards" 
            content="All data transmission within the Rushcart mesh is encrypted using Tier 1 cryptographic standards. We utilize end-to-end multi-layer protection for all procurement information and identity manifests."
          />
          <Section 
            Icon={Lock} 
            title="Logistics Authorization" 
            content="Your data is shared only with authorized vendors and logistics partner terminal nodes strictly for the execution of procurement orders. Third-party data trade is strictly prohibited under Rushcart core directives."
          />
          <Section 
            Icon={FileText} 
            title="Manifest Updates" 
            content="We reserve the Right of System Update to these protocols. Continued presence in the ecosystem constitutes acceptance of current data governance standards."
          />
        </div>

        <footer className="mt-32 pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            Secure connection verified by Rushcart Prime Security Node 01
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
    className="space-y-6 group"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
        <Icon size={24} />
      </div>
      <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest">{title}</h2>
    </div>
    <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-medium pl-16">
      {content}
    </p>
  </motion.section>
);

"use client";
import { useRouter } from "next/navigation";
import { IUser } from "@/models/user.model";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck
} from "lucide-react";
import { FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

export default function Footer({ user }: { user: IUser }) {
  const router = useRouter();
  const role = user?.role;
  const isUser = role === "user";
  const isAdminOrVendor = role === "admin" || role === "vendor";

  return (
    <footer className="relative w-full bg-[#050505] text-gray-500 py-20 border-t border-white/5 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className={`grid gap-12 ${isUser ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}`}>
          
          {/* Brand Identity */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 
                onClick={() => router.push("/")}
                className="text-3xl font-black text-white cursor-pointer tracking-tighter"
              >
                Rush<span className="text-blue-500">cart</span>
              </h2>
              <p className="text-sm leading-relaxed font-medium">
                The next generation of multi-vendor commerce. Engineered for speed, designed for the future, and built for you.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <SocialIcon Icon={FaInstagram} href="https://instagram.com/rushcart" />
              <SocialIcon Icon={FaXTwitter} href="https://twitter.com/rushcart" />
              <SocialIcon Icon={FaLinkedinIn} href="https://linkedin.com/company/rushcart" />
            </div>
          </div>

          {/* User Links */}
          {isUser && (
            <div className="space-y-8">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Platform</h3>
              <ul className="space-y-4">
                <FooterLink label="Explore Categories" onClick={() => router.push("/category")} />
                <FooterLink label="Trusted Sellers" onClick={() => router.push("/shop")} />
                <FooterLink label="Trending Products" onClick={() => router.push("/")} />
                <FooterLink label="Customer Support" onClick={() => router.push("/support")} />
              </ul>
            </div>
          )}

          {/* Account/Dashboard */}
          <div className="space-y-8">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Management</h3>
            <ul className="space-y-4">
              <FooterLink label="My Profile" onClick={() => router.push("/profile")} />
              <FooterLink label="Track Orders" onClick={() => router.push("/orders")} />
            </ul>
            {isAdminOrVendor && (
              <div className="pt-4 p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  {role} Access
                </div>
                <p className="text-[10px] uppercase font-bold text-gray-500">Secure Internal Dashboard</p>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Get in Touch</h3>
            <div className="space-y-6">
              <ContactItem Icon={Mail} text="admin@rushcart.com" />
              <ContactItem Icon={Phone} text="+91 98765 43210" />
              <ContactItem Icon={MapPin} text="Cyber Hub, DLF Phase 3, Gurgaon" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            © {new Date().getFullYear()} Rushcart Ecosystem — All Rights Reserved
          </p>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
            <button title="Privacy Policy" onClick={() => router.push("/privacy")} className="hover:text-white transition-colors">Privacy Policy</button>
            <button title="Terms of Service" onClick={() => router.push("/terms")} className="hover:text-white transition-colors">Terms of Service</button>
            <button title="Forgot Login" onClick={() => router.push("/login")} className="hover:text-blue-400 text-blue-500/80 transition-colors">Forgot Login?</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  label: string;
  onClick: () => void;
}

const FooterLink = ({ label, onClick }: FooterLinkProps) => (
  <li 
    onClick={onClick}
    className="group flex items-center gap-2 cursor-pointer hover:text-white transition-colors text-sm font-bold"
  >
    <div className="w-0 group-hover:w-2 h-px bg-blue-500 transition-all" />
    {label}
  </li>
);

interface SocialIconProps {
  Icon: React.ComponentType<{ size: number }>;
  href: string;
}

const SocialIcon = ({ Icon, href }: SocialIconProps) => (
  <a 
    href={href}
    title={href}
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-blue-500 hover:border-blue-500 transition-all cursor-pointer"
  >
    <Icon size={18} />
  </a>
);

interface ContactItemProps {
  Icon: React.ComponentType<{ size: number }>;
  text: string;
}

const ContactItem = ({ Icon, text }: ContactItemProps) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-500 group-hover:scale-110 transition-transform">
      <Icon size={18} />
    </div>
    <span className="text-sm font-bold">{text}</span>
  </div>
);

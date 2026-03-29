"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/5 text-blue-500 hover:bg-white/10 transition-all flex items-center justify-center relative overflow-hidden group shadow-lg shadow-blue-500/10"
      title="Toggle Interface Mode"
    >
        <div className="relative w-5 h-5 flex items-center justify-center">
            <Sun className={`w-5 h-5 transition-all duration-500 ${theme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`} />
            <Moon className={`absolute w-5 h-5 transition-all duration-500 ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`} />
        </div>
        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}

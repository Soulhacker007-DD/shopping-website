import type { Metadata } from "next";

import "./globals.css";

import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";





import { ThemeProvider } from "@/component/theme-provider";
import AIChatbot from "@/component/AIChatbot";
import VoiceNavigation from "@/component/VoiceNavigation";

export const metadata: Metadata = {
  title: "Rushcart — Premium Commerce",
  description: "Next-generation multi-vendor ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white relative transition-colors duration-500"> 
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          {/* Global Premium Background Overlay */}
          <div 
            className="fixed inset-0 z-[-2] pointer-events-none opacity-[0.05] dark:opacity-[0.15] transition-opacity duration-700 bg-premium-overlay" 
          />
          <div className="fixed inset-0 z-[-1] pointer-events-none bg-radial-at-t from-blue-500/5 via-transparent to-transparent" />
         
          <Provider>
            <StoreProvider>
              <InitUser/>
              <main className="relative z-10">
                {children}
              </main>
              <AIChatbot />
              <div className="fixed bottom-6 left-6 z-[9999]">
                <VoiceNavigation />
              </div>
            </StoreProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't show if already installed or dismissed this session
    if (sessionStorage.getItem("pwa-dismissed")) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 4000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("pwa-dismissed", "1");
    setVisible(false);
    setDismissed(true);
  };

  if (dismissed || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-[200] bg-[#0e0e0e] border border-[#C9A84C]/30 shadow-2xl hud-cut"
        >
          {/* Gold shimmer top bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

          <div className="flex items-center gap-3 p-3.5">
            {/* App icon placeholder */}
            <div className="w-10 h-10 bg-[#111] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
              <span className="font-display text-sm text-gold-gradient font-bold">A</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#F5F0E8] leading-tight">Add AURUM to Home Screen</p>
              <p className="font-mono text-[9px] text-[#555] mt-0.5 tracking-wide">Play offline · No browser bar</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstall}
                className="btn-shine px-3 py-1.5 bg-[#C9A84C] text-[#080808] text-[10px] font-bold tracking-widest uppercase"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="w-6 h-6 flex items-center justify-center text-[#555] hover:text-[#888] transition-colors"
                aria-label="Dismiss"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

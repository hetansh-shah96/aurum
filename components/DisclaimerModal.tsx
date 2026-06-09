"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "aurum-disclaimer-seen";

export function DisclaimerModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100]"
          />
          <motion.div
            key="modal"
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md border border-[#C9A84C]/40 bg-[#0e0e0e] rounded-sm gold-glow-strong overflow-hidden">
              {/* Gold top bar */}
              <div className="h-1 bg-gradient-to-r from-[#8B6914] via-[#E8D5A3] to-[#8B6914]" />

              <div className="p-8 text-center">
                <div className="text-5xl mb-5">◈</div>

                <p className="text-[#C9A84C] text-[10px] tracking-[0.4em] uppercase mb-3">
                  Welcome to AURUM
                </p>
                <h2 className="font-display text-3xl text-[#F5F0E8] mb-4 leading-tight">
                  This is a simulation.
                </h2>

                <div className="space-y-3 text-sm text-[#888] leading-relaxed mb-8">
                  <p>
                    AURUM is a <span className="text-[#C9A84C]">dopamine shopping experience</span>. Browse the
                    world's most exclusive luxury goods, fill your cart, and go through checkout — completely free.
                  </p>
                  <p>
                    <span className="text-[#F5F0E8]">Nothing gets delivered.</span> No real payments are taken.
                    No personal data is stored. It's entirely fictional.
                  </p>
                  <p className="text-[#555]">
                    Inspired by South Korea's "dopamine sites" trend — the joy of buying, without the cost.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: "🚫", label: "No real charges" },
                    { icon: "📦", label: "Nothing shipped" },
                    { icon: "🔒", label: "No data stored" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 border border-[#2a2a2a] rounded-sm">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-[9px] text-[#555] tracking-wider uppercase leading-tight text-center">{item.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={dismiss}
                  className="btn-shine w-full py-4 bg-[#C9A84C] text-[#080808] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#E8D5A3] transition-colors"
                >
                  I Understand — Let Me Shop
                </button>

                <p className="text-[10px] text-[#333] mt-4 tracking-wide">
                  This message is shown once and will not appear again.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

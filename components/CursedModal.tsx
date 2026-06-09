"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const CURSED_SCRIPTS: Record<string, { title: string; lines: string[] }> = {
  "bugatti-chiron": {
    title: "Interpol has been notified",
    lines: [
      "🚨 Your Bugatti triggered 14 international emissions violations.",
      "The EU, UN, and your building's RWA have filed complaints.",
      "Your CA has resigned. Your driver has also resigned.",
      "A philosopher called to ask why you exist.",
      "All AURUM Coins confiscated as 'carbon tax'.",
    ],
  },
  "gulfstream-g700": {
    title: "The taxman has arrived",
    lines: [
      "🛩️ Congratulations on your ₹712Cr private jet.",
      "The Income Tax Department sends their regards.",
      "The Enforcement Directorate sends their team.",
      "Your CA has also bought a jet (using your money).",
      "All AURUM Coins seized under FEMA Act, Section ∞.",
    ],
  },
};

const GENERIC_CURSE = {
  title: "The universe noticed",
  lines: [
    "⚡ You bought something the universe disapproves of.",
    "Nobody knows why. The cosmos works in strange ways.",
    "A monk in Tibet shook his head.",
    "Your horoscope this week: 'Avoid expensive decisions.'",
    "All AURUM Coins vanished into the void.",
  ],
};

interface Props {
  productId: string | null;
  onClose: () => void;
}

export function CursedModal({ productId, onClose }: Props) {
  const [coins, setCoins] = useState(0);
  const [draining, setDraining] = useState(false);

  useEffect(() => {
    if (!productId) return;
    // Animate coin counter drain
    setDraining(true);
    const start = Date.now();
    const duration = 2000;
    const startCoins = 999999;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCoins(Math.floor(startCoins * (1 - eased)));
      if (progress < 1) requestAnimationFrame(tick);
      else setDraining(false);
    };
    requestAnimationFrame(tick);
  }, [productId]);

  const script = productId ? (CURSED_SCRIPTS[productId] ?? GENERIC_CURSE) : GENERIC_CURSE;

  return (
    <AnimatePresence>
      {productId && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[110]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[111] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm">
              {/* Red warning bar */}
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.4, repeat: 4 }}
                className="h-1 bg-red-500 mb-0"
              />

              <div className="bg-[#0a0000] border border-red-900/60 p-6">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                  className="text-5xl text-center mb-4"
                >
                  💸
                </motion.div>

                <p className="text-[10px] text-red-500 tracking-[0.4em] uppercase text-center mb-2">
                  Cosmic Punishment
                </p>
                <h2 className="font-display text-2xl text-red-400 text-center mb-5 leading-tight">
                  {script.title}
                </h2>

                <div className="space-y-2 mb-6">
                  {script.lines.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.18 }}
                      className="text-xs text-[#888] leading-relaxed"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                {/* Coin drain counter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="border border-red-900/40 bg-red-500/5 p-3 text-center mb-5"
                >
                  <p className="text-[10px] text-red-500 uppercase tracking-widest mb-1">AURUM Coins Remaining</p>
                  <motion.p
                    className="font-display text-3xl text-red-400 font-semibold tabular-nums"
                  >
                    ₳{coins.toLocaleString("en-IN")}
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  <p className="text-[10px] text-[#444] text-center mb-4">
                    The silver lining: your wallet was replenished.<br />
                    <span className="text-[#555]">Life giveth and life taketh away.</span>
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full py-3 border border-red-900/40 text-red-500 text-xs tracking-widest uppercase hover:bg-red-500/5 transition-colors"
                  >
                    Accept Fate & Continue
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

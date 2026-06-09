"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useWalletStore, selectPlayerRank, getRequiredRank, RANKS } from "@/lib/wallet-store";
import { PRODUCTS, formatPrice } from "@/lib/products";
import Image from "next/image";

export function RankUpModal() {
  const [unlockedRank, setUnlockedRank] = useState<(typeof RANKS)[number] | null>(null);
  const prevLevelRef = useRef<number | null>(null);

  useEffect(() => {
    // Subscribe to wallet store changes — detect rank increase
    const unsub = useWalletStore.subscribe((state) => {
      const rank = selectPlayerRank(state);
      if (prevLevelRef.current === null) {
        prevLevelRef.current = rank.level;
        return;
      }
      if (rank.level > prevLevelRef.current) {
        prevLevelRef.current = rank.level;
        setUnlockedRank(rank);
      }
    });
    // Set initial level
    prevLevelRef.current = selectPlayerRank(useWalletStore.getState()).level;
    return unsub;
  }, []);

  useEffect(() => {
    if (!unlockedRank) return;
    const burst = () => {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.4 }, colors: ["#C9A84C", "#E8D5A3", "#FFD700", "#FFF"] });
      setTimeout(() => confetti({ particleCount: 60, spread: 90, angle: 60, origin: { x: 0, y: 0.5 }, colors: ["#C9A84C", "#E8D5A3"] }), 200);
      setTimeout(() => confetti({ particleCount: 60, spread: 90, angle: 120, origin: { x: 1, y: 0.5 }, colors: ["#C9A84C", "#FFD700"] }), 400);
    };
    burst();
    const t = setTimeout(burst, 1000);
    return () => clearTimeout(t);
  }, [unlockedRank]);

  const newlyUnlocked = unlockedRank
    ? PRODUCTS.filter((p) => getRequiredRank(p.price).level === unlockedRank.level).slice(0, 6)
    : [];

  return (
    <AnimatePresence>
      {unlockedRank && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
            onClick={() => setUnlockedRank(null)}
          />
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-[#0a0a0a] border rounded-sm overflow-hidden"
              style={{ borderColor: `${unlockedRank.color}66` }}
            >
              {/* Gold shimmer bar */}
              <div className="h-1 shimmer" />

              <div className="p-8 text-center">
                {/* Rank icon — pulsing */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.8, repeat: 2 }}
                  className="text-6xl mb-4"
                  style={{ color: unlockedRank.color }}
                >
                  {unlockedRank.icon}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs tracking-[0.4em] uppercase text-[#555] mb-2"
                >
                  Rank Unlocked
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-5xl font-semibold mb-2"
                  style={{ color: unlockedRank.color }}
                >
                  {unlockedRank.name}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-[#888] mb-8"
                >
                  {newlyUnlocked.length} exclusive items now available to you
                </motion.p>

                {/* Newly unlocked items */}
                {newlyUnlocked.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                  >
                    <p className="text-[10px] text-[#555] uppercase tracking-widest mb-3">Now unlocked for you</p>
                    <div className="grid grid-cols-3 gap-2">
                      {newlyUnlocked.map((p, i) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + i * 0.08 }}
                          className="border border-[#2a2a2a] rounded-sm overflow-hidden"
                        >
                          <div className="relative aspect-square">
                            <Image src={p.image} alt={p.name} fill className="object-cover" sizes="120px" />
                          </div>
                          <div className="p-1.5">
                            <p className="text-[9px] text-[#888] truncate leading-tight">{p.brand}</p>
                            <p className="text-[9px] text-[#C9A84C]">{formatPrice(p.price)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setUnlockedRank(null)}
                  className="btn-shine w-full py-4 text-sm font-semibold tracking-[0.2em] uppercase"
                  style={{ background: unlockedRank.color, color: "#080808" }}
                >
                  Start Conquering →
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

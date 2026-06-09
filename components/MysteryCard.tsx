"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCoinsStore } from "@/lib/coins-store";
import { useCartStore } from "@/lib/cart-store";
import { useWalletStore, selectPlayerRank, getRequiredRank } from "@/lib/wallet-store";
import { PRODUCTS, formatPrice } from "@/lib/products";
import { useCoinsToast } from "./CoinsToast";

const COST = 50_000;

export function MysteryCard() {
  const [phase, setPhase] = useState<"idle" | "spinning" | "revealed">("idle");
  const [revealed, setRevealed] = useState<(typeof PRODUCTS)[0] | null>(null);
  const { balance, convertToWallet, earnCoins } = useCoinsStore();
  const addItem = useCartStore((s) => s.addItem);
  const playerRank = useWalletStore(selectPlayerRank);
  const { showToast } = useCoinsToast();

  const canOpen = balance >= COST;

  const handleOpen = () => {
    if (!canOpen || phase !== "idle") return;
    const ok = convertToWallet(COST);
    if (!ok) return;

    setPhase("spinning");

    // Pick a random product the player can access
    const eligible = PRODUCTS.filter((p) => getRequiredRank(p.price).level <= playerRank.level);
    const pick = eligible[Math.floor(Math.random() * eligible.length)];

    setTimeout(() => {
      setRevealed(pick);
      setPhase("revealed");
      addItem(pick);
      showToast(0, `${pick.brand} ${pick.name} added to cart!`, true);
    }, 2000);
  };

  const reset = () => { setPhase("idle"); setRevealed(null); };

  return (
    <div className="relative bg-[#0e0e0e] border border-[#C9A84C]/25 rounded-sm overflow-hidden group">
      {/* Gold shimmer top bar */}
      <div className="h-0.5 shimmer" />

      <div className="aspect-square relative flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center px-4">
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl mb-3"
              >
                🎁
              </motion.div>
              <p className="text-[9px] text-[#C9A84C] tracking-[0.3em] uppercase mb-1">Mystery Drop</p>
              <p className="font-display text-sm text-[#F5F0E8] leading-tight mb-2">Maison Blind Box</p>
              <p className="text-[9px] text-[#555] mb-3">A curated surprise from the collection</p>
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <span className="text-[10px] text-[#C9A84C] font-semibold">₳{COST.toLocaleString("en-IN")}</span>
              </div>
            </motion.div>
          )}

          {phase === "spinning" && (
            <motion.div key="spinning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center px-4">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                className="text-5xl mb-3"
              >
                ✨
              </motion.div>
              <p className="text-xs text-[#C9A84C] tracking-widest">Curating your drop...</p>
            </motion.div>
          )}

          {phase === "revealed" && revealed && (
            <motion.div
              key="revealed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Image src={revealed.image} alt={revealed.name} fill className="object-cover" sizes="300px" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[9px] text-[#C9A84C] tracking-widest uppercase">{revealed.brand}</p>
                <p className="text-sm font-display text-[#F5F0E8] leading-tight">{revealed.name}</p>
                <p className="text-[10px] text-[#888]">{formatPrice(revealed.price)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3">
        {phase !== "revealed" ? (
          <button
            onClick={handleOpen}
            disabled={!canOpen || phase === "spinning"}
            className={`btn-shine w-full py-2 text-[9px] font-semibold tracking-widest uppercase transition-all rounded-sm ${
              canOpen && phase === "idle"
                ? "bg-[#C9A84C] text-[#080808] hover:bg-[#E8D5A3]"
                : "border border-[#2a2a2a] text-[#444] cursor-not-allowed"
            }`}
          >
            {phase === "spinning" ? "Opening..." : canOpen ? "Open Box" : `Need ₳${COST.toLocaleString("en-IN")}`}
          </button>
        ) : (
          <div className="space-y-1.5">
            <p className="text-[9px] text-green-400 text-center tracking-wide">✓ Added to cart</p>
            <button onClick={reset} className="w-full py-1.5 text-[9px] border border-[#2a2a2a] text-[#555] hover:text-[#888] transition-colors rounded-sm tracking-widest uppercase">
              Open Another
            </button>
          </div>
        )}
        {!canOpen && phase === "idle" && (
          <p className="text-[8px] text-[#333] text-center mt-1">
            ₳{(COST - balance).toLocaleString("en-IN")} more needed
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useWalletStore, TIERS, Tier } from "@/lib/wallet-store";
import { useCartStore } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/products";

export function WalletBadge() {
  const { balance, tier, setTier, replenish, spent } = useWalletStore();
  const { totalPrice } = useCartStore();
  const [open, setOpen] = useState(false);
  const [prevBalance, setPrevBalance] = useState(balance);
  const [flash, setFlash] = useState(false);

  // Sync wallet deduction with cart total (show live "if you buy this" balance)
  const projected = Math.max(0, balance - totalPrice);
  const isLow = projected < balance * 0.1;

  useEffect(() => {
    if (balance !== prevBalance) {
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
      setPrevBalance(balance);
    }
  }, [balance, prevBalance]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs transition-all duration-200 ${
          flash
            ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
            : isLow
            ? "border-amber-500/50 text-amber-400"
            : "border-[#2a2a2a] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C]"
        }`}
      >
        <span>◈</span>
        <motion.span
          key={Math.round(projected / 1000)}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono tracking-wider"
        >
          {formatWalletBalance(projected)}
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-[#0e0e0e] border border-[#2a2a2a] rounded-sm shadow-2xl z-50 p-5"
          >
            <p className="text-xs text-[#555] tracking-widest uppercase mb-1">Your Virtual Wallet</p>
            <p className="font-display text-2xl text-gold-gradient mb-4">{formatPrice(Math.max(0, projected))}</p>

            {totalPrice > 0 && (
              <div className="mb-4 p-2.5 bg-[#111] border border-[#2a2a2a] rounded-sm">
                <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Cart Impact</p>
                <p className="text-xs text-[#888]">
                  After purchase: <span className="text-[#C9A84C]">{formatPrice(Math.max(0, balance - totalPrice))}</span>
                </p>
              </div>
            )}

            <div className="space-y-1 mb-4">
              <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Change Tier</p>
              {(Object.entries(TIERS) as [Tier, typeof TIERS[Tier]][]).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => { setTier(key); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs transition-all ${
                    tier === key
                      ? "bg-[#C9A84C]/10 border border-[#C9A84C]/40 text-[#C9A84C]"
                      : "border border-[#2a2a2a] text-[#888] hover:border-[#C9A84C]/30 hover:text-[#C9A84C]"
                  }`}
                >
                  <span className="tracking-wider">{t.label}</span>
                  <span className="font-mono">{formatWalletBalance(t.balance)}</span>
                </button>
              ))}
            </div>

            {spent > 0 && (
              <div className="mb-3 text-center">
                <p className="text-[10px] text-[#555]">
                  You've virtually spent <span className="text-[#C9A84C]">{formatPrice(spent)}</span> today
                </p>
              </div>
            )}

            <button
              onClick={() => { replenish(); setOpen(false); }}
              className="w-full py-2 border border-[#2a2a2a] text-[#888] text-xs tracking-widest uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors rounded-sm"
            >
              ↺ Replenish Wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatWalletBalance(n: number): string {
  if (n >= 1_00_00_00_000) return `₹${(n / 1_00_00_00_000).toFixed(0)}Cr`;
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

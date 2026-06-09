"use client";

import { useWalletStore, TIERS, DRIP_MS, Tier } from "@/lib/wallet-store";
import { useCartStore, selectTotalPrice } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/products";

function useDripCountdown() {
  const lastReplenishTime = useWalletStore((s) => s.lastReplenishTime);
  const tier = useWalletStore((s) => s.tier);
  const balance = useWalletStore((s) => s.balance);
  const checkDrip = useWalletStore((s) => s.checkDrip);
  const [msLeft, setMsLeft] = useState(0);

  useEffect(() => {
    const tick = () => {
      const nextDrip = lastReplenishTime + DRIP_MS;
      const left = nextDrip - Date.now();
      if (left <= 0) {
        checkDrip();
        setMsLeft(0);
      } else {
        setMsLeft(left);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastReplenishTime, checkDrip]);

  const maxBalance = TIERS[tier].maxBalance;
  const dripAmount = TIERS[tier].dripAmount;
  const isFull = balance >= maxBalance;

  const h = Math.floor(msLeft / 3_600_000);
  const m = Math.floor((msLeft % 3_600_000) / 60_000);
  const s = Math.floor((msLeft % 60_000) / 1000);
  const countdown = `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  return { countdown, dripAmount, isFull, msLeft };
}

function formatWalletBalance(n: number): string {
  if (n >= 1_00_00_00_000) return `₹${(n / 1_00_00_00_000).toFixed(0)}Cr`;
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function WalletBadge() {
  const { balance, tier, setTier, spent } = useWalletStore();
  const totalPrice = useCartStore(selectTotalPrice);
  const [open, setOpen] = useState(false);
  const [prevBalance, setPrevBalance] = useState(balance);
  const [flash, setFlash] = useState(false);
  const { countdown, dripAmount, isFull } = useDripCountdown();

  const projected = Math.max(0, balance - totalPrice);
  const maxBalance = TIERS[tier].maxBalance;
  const fillPct = Math.min(100, (balance / maxBalance) * 100);

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
            : balance === 0
            ? "border-red-500/40 text-red-400/70"
            : "border-[#2a2a2a] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C]"
        }`}
      >
        <span className={balance === 0 ? "text-red-400/70" : ""}>◈</span>
        <motion.span
          key={Math.round(projected / 1000)}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono tracking-wider"
        >
          {formatWalletBalance(projected)}
        </motion.span>
        {!isFull && (
          <span className="text-[9px] text-[#555] hidden sm:inline tabular-nums">+{formatWalletBalance(dripAmount)}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-[#0e0e0e] border border-[#2a2a2a] rounded-sm shadow-2xl z-50 p-5"
          >
            <p className="text-[10px] text-[#555] tracking-widest uppercase mb-1">Your Virtual Wallet</p>
            <p className="font-display text-2xl text-gold-gradient mb-1">{formatPrice(Math.max(0, projected))}</p>

            {/* Fill bar */}
            <div className="mb-4">
              <div className="h-1.5 bg-[#222] rounded-full overflow-hidden mb-1.5">
                <motion.div
                  animate={{ width: `${fillPct}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#8B6914] to-[#C9A84C]"
                />
              </div>
              <div className="flex justify-between text-[9px] text-[#444]">
                <span>{formatWalletBalance(balance)}</span>
                <span>max {formatWalletBalance(maxBalance)}</span>
              </div>
            </div>

            {/* Drip countdown */}
            {!isFull && (
              <div className="flex items-center justify-between mb-4 p-2.5 bg-[#111] border border-[#2a2a2a] rounded-sm">
                <div>
                  <p className="text-[9px] text-[#555] uppercase tracking-widest">Next refill</p>
                  <p className="text-sm font-mono text-[#C9A84C] tabular-nums">{countdown}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-[#555]">Amount</p>
                  <p className="text-sm text-[#888]">+{formatWalletBalance(dripAmount)}</p>
                </div>
              </div>
            )}
            {isFull && (
              <div className="mb-4 p-2.5 text-center border border-green-500/20 bg-green-500/5 rounded-sm">
                <p className="text-xs text-green-400">✓ Wallet is full</p>
              </div>
            )}

            {totalPrice > 0 && (
              <div className="mb-4 p-2.5 bg-[#111] border border-[#2a2a2a] rounded-sm">
                <p className="text-[9px] text-[#555] uppercase tracking-widest mb-1">After Purchase</p>
                <p className="text-xs text-[#888]">
                  <span className="text-[#C9A84C]">{formatPrice(Math.max(0, balance - totalPrice))}</span> remaining
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <p className="text-[9px] text-[#555] uppercase tracking-widest mb-2">Change Tier</p>
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
                  <span className="font-mono text-[10px]">{formatWalletBalance(t.maxBalance)} max</span>
                </button>
              ))}
            </div>

            {spent > 0 && (
              <p className="text-[9px] text-[#444] text-center mt-3">
                You've spent <span className="text-[#555]">{formatPrice(spent)}</span> this session
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

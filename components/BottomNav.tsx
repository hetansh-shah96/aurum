"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore, selectTotalCount } from "@/lib/cart-store";
import { useWalletStore, TIERS, DRIP_MS, selectPlayerRank } from "@/lib/wallet-store";
import { useCoinsStore, selectCanClaim } from "@/lib/coins-store";
import { useCoinsToast } from "./CoinsToast";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/products";

function MobileWalletSheet({ onClose }: { onClose: () => void }) {
  const { balance, tier, setTier, lastReplenishTime, checkDrip, spent } = useWalletStore();
  const { balance: coins, claimDaily, convertToWallet } = useCoinsStore();
  const canClaim = useCoinsStore(selectCanClaim);
  const { showToast } = useCoinsToast();
  const playerRank = useWalletStore(selectPlayerRank);
  const [msLeft, setMsLeft] = useState(0);
  const [convertSuccess, setConvertSuccess] = useState(false);

  useEffect(() => {
    const tick = () => {
      const left = lastReplenishTime + DRIP_MS - Date.now();
      setMsLeft(left > 0 ? left : 0);
      if (left <= 0) checkDrip();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastReplenishTime, checkDrip]);

  const maxBalance = TIERS[tier].maxBalance;
  const dripAmount = TIERS[tier].dripAmount;
  const fillPct = Math.min(100, (balance / maxBalance) * 100);
  const h = Math.floor(msLeft / 3_600_000);
  const m = Math.floor((msLeft % 3_600_000) / 60_000);
  const s = Math.floor((msLeft % 60_000) / 1000);
  const countdown = `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  const isFull = balance >= maxBalance;

  const handleClaim = () => {
    const result = claimDaily();
    if (result) showToast(result.coins, `Day ${result.streak} streak!`);
  };

  const handleConvert = () => {
    if (coins < 10_000) return;
    const amount = coins;
    const ok = convertToWallet(amount);
    if (ok) {
      useWalletStore.setState((s) => ({ balance: Math.min(TIERS[s.tier].maxBalance, s.balance + amount) }));
      showToast(amount, "converted to wallet!");
      setConvertSuccess(true);
      setTimeout(() => setConvertSuccess(false), 2000);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-[60]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-[61] bg-[#0e0e0e] border-t border-[#2a2a2a] rounded-t-2xl safe-bottom overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#333] rounded-full" />
        </div>

        <div className="px-5 pt-2 pb-6 space-y-4">
          {/* Rank + Balance */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[#555] uppercase tracking-widest">Wallet Balance</p>
              <p className="font-display text-3xl text-gold-gradient font-semibold">{formatPrice(balance)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#555] uppercase tracking-widest">Rank</p>
              <p className="text-base font-semibold" style={{ color: playerRank.color }}>
                {playerRank.icon} {playerRank.name}
              </p>
            </div>
          </div>

          {/* Wallet fill bar */}
          <div>
            <div className="h-2 bg-[#222] rounded-full overflow-hidden mb-1">
              <motion.div
                animate={{ width: `${fillPct}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-[#8B6914] to-[#C9A84C]"
              />
            </div>
            <div className="flex justify-between text-[9px] text-[#444]">
              <span>{formatPrice(balance)}</span>
              <span>Max {formatPrice(maxBalance)}</span>
            </div>
          </div>

          {/* Drip countdown */}
          {!isFull ? (
            <div className="flex items-center justify-between p-3 bg-[#111] border border-[#2a2a2a] rounded-sm">
              <div>
                <p className="text-[9px] text-[#555] uppercase tracking-widest">Next refill in</p>
                <p className="text-xl font-mono text-[#C9A84C] tabular-nums font-semibold">{countdown}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-[#555] mb-0.5">Amount</p>
                <p className="text-sm text-[#888] font-semibold">+{formatPrice(dripAmount)}</p>
              </div>
            </div>
          ) : (
            <div className="p-3 text-center border border-green-500/20 bg-green-500/5 rounded-sm">
              <p className="text-sm text-green-400 font-semibold">✓ Wallet full — go shop!</p>
            </div>
          )}

          {/* AURUM Coins + daily claim */}
          <div className="border border-[#2a2a2a] rounded-sm overflow-hidden">
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="text-[9px] text-[#555] uppercase tracking-widest">AURUM Coins</p>
                <p className="text-lg font-mono text-[#C9A84C] font-semibold">
                  ₳{coins >= 1_00_000 ? `${(coins / 1_00_000).toFixed(1)}L` : coins.toLocaleString("en-IN")}
                </p>
              </div>
              {canClaim ? (
                <button
                  onClick={handleClaim}
                  className="btn-shine px-3 py-2 bg-[#C9A84C] text-[#080808] text-[10px] font-bold tracking-widest uppercase rounded-sm"
                >
                  🪙 Claim Daily
                </button>
              ) : (
                <p className="text-[9px] text-[#444] text-right">✓ Claimed<br />today</p>
              )}
            </div>
            {coins >= 10_000 && (
              <button
                onClick={handleConvert}
                className={`w-full py-2 text-[10px] tracking-widest uppercase transition-colors border-t border-[#2a2a2a] ${
                  convertSuccess
                    ? "bg-green-500/10 text-green-400"
                    : "text-[#555] hover:text-[#C9A84C] hover:bg-[#C9A84C]/5"
                }`}
              >
                {convertSuccess ? "✓ Coins added to wallet!" : `Convert ₳${coins >= 1_00_000 ? `${(coins / 1_00_000).toFixed(1)}L` : coins.toLocaleString("en-IN")} → Wallet`}
              </button>
            )}
          </div>

          {/* Tier switcher */}
          <div>
            <p className="text-[9px] text-[#555] uppercase tracking-widest mb-2">Wallet Tier</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(TIERS) as [keyof typeof TIERS, typeof TIERS[keyof typeof TIERS]][]).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => { setTier(key); onClose(); }}
                  className={`py-2.5 px-2 rounded-sm text-[10px] transition-all border ${
                    tier === key
                      ? "bg-[#C9A84C]/10 border-[#C9A84C]/40 text-[#C9A84C] font-semibold"
                      : "border-[#2a2a2a] text-[#555] hover:border-[#C9A84C]/30"
                  }`}
                >
                  <p className="truncate">{t.label}</p>
                  <p className="text-[9px] text-[#444] mt-0.5">{formatPrice(t.maxBalance)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { openCart } = useCartStore();
  const totalCount = useCartStore(selectTotalCount);
  const balance = useWalletStore((s) => s.balance);
  const tier = useWalletStore((s) => s.tier);
  const [walletOpen, setWalletOpen] = useState(false);

  const maxBalance = TIERS[tier].maxBalance;
  const fillPct = Math.min(100, (balance / maxBalance) * 100);
  const isEmpty = balance === 0;

  const navLinks = [
    {
      href: "/",
      label: "Home",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: "/shop",
      label: "Shop",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060608]/98 backdrop-blur-md border-t border-[#1a1a2a] safe-bottom">
        <div className="flex items-center px-2 py-1">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href === "/shop" && pathname.startsWith("/shop"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg transition-colors ${
                  active ? "text-[#C9A84C]" : "text-[#555]"
                }`}
              >
                {link.icon}
                <span className="text-[9px] tracking-widest uppercase">{link.label}</span>
              </Link>
            );
          })}

          {/* Wallet button — shows fill bar */}
          <button
            onClick={() => setWalletOpen(true)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <svg className={`w-5 h-5 ${isEmpty ? "text-red-400" : "text-[#555]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {isEmpty && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border border-[#0a0a0a]" />
              )}
            </div>
            {/* Mini fill bar */}
            <div className="w-8 h-0.5 bg-[#222] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${fillPct}%`,
                  background: isEmpty ? "#ef4444" : `linear-gradient(90deg, #8B6914, #C9A84C)`,
                }}
              />
            </div>
            <span className={`text-[9px] tracking-widest uppercase ${isEmpty ? "text-red-400" : "text-[#555]"}`}>
              {isEmpty ? "Empty" : "Wallet"}
            </span>
          </button>

          {/* Cart */}
          <button
            onClick={openCart}
            className="flex-1 relative flex flex-col items-center gap-0.5 py-2 text-[#555] active:text-[#C9A84C] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-[9px] tracking-widest uppercase">Cart</span>
            <AnimatePresence>
              {totalCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute top-1 right-4 w-4 h-4 rounded-full bg-[#C9A84C] text-[#080808] text-[9px] font-bold flex items-center justify-center"
                >
                  {totalCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Wallet slide-up sheet */}
      <AnimatePresence>
        {walletOpen && <MobileWalletSheet onClose={() => setWalletOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoinsStore, selectCanClaim, selectCoinTier, getTierForCoins, getNextTier, TIERS } from "@/lib/coins-store";
import { useWalletStore } from "@/lib/wallet-store";
import { useCoinsToast } from "./CoinsToast";

const FAKE_LEADERBOARD = [
  { name: "Arjun M.",    coins: 48_50_000, tier: 3 },
  { name: "Priya S.",    coins: 32_10_000, tier: 3 },
  { name: "Rohan K.",    coins: 18_75_000, tier: 3 },
  { name: "Ananya P.",   coins: 9_20_000,  tier: 2 },
  { name: "Vikram T.",   coins: 7_43_000,  tier: 2 },
  { name: "You",         coins: 0,         tier: 0, isYou: true },
];

export function CoinsDisplay() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"overview" | "leaderboard" | "convert">("overview");
  const [convertAmount, setConvertAmount] = useState("");
  const [convertSuccess, setConvertSuccess] = useState(false);

  const { balance, totalEarned, streak, claimDaily, convertToWallet } = useCoinsStore();
  const canClaim = useCoinsStore(selectCanClaim);
  const tier = useCoinsStore(selectCoinTier);
  const nextTier = getNextTier(totalEarned);
  const { balance: walletBalance, setTier: setWalletTier } = useWalletStore();
  const { showToast } = useCoinsToast();

  // Progress to next tier (0–1)
  const tierProgress = nextTier
    ? (totalEarned - tier.minCoins) / (nextTier.minCoins - tier.minCoins)
    : 1;

  const handleQuickClaim = () => {
    const result = claimDaily();
    if (result) showToast(result.coins, `Day ${result.streak} streak!`);
  };

  const handleConvert = () => {
    const amount = parseInt(convertAmount.replace(/,/g, ""), 10);
    if (!amount || amount < 10_000) return;
    const ok = convertToWallet(amount);
    if (ok) {
      // Add to wallet balance via wallet store
      useWalletStore.setState((s) => ({ balance: s.balance + amount }));
      setConvertSuccess(true);
      showToast(amount, "converted to wallet!");
      setTimeout(() => { setConvertSuccess(false); setConvertAmount(""); }, 2000);
    }
  };

  const leaderboardWithYou = FAKE_LEADERBOARD.map((e) =>
    e.isYou ? { ...e, coins: balance, tier: TIERS.findIndex((t) => t === tier) } : e
  ).sort((a, b) => b.coins - a.coins);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2a2a2a] rounded-full hover:border-[#C9A84C]/60 transition-colors group"
      >
        <span className="text-sm" style={{ color: tier.color }}>{tier.icon.slice(0, 1)}</span>
        <span className="font-mono text-xs text-[#C9A84C]">
          ₳{balance >= 1_00_000
            ? `${(balance / 1_00_000).toFixed(1)}L`
            : balance.toLocaleString("en-IN")}
        </span>
        {canClaim && (
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-gold" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[#0e0e0e] border border-[#2a2a2a] rounded-sm shadow-2xl z-50 overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex border-b border-[#2a2a2a]">
              {(["overview", "leaderboard", "convert"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 text-[10px] tracking-widest uppercase transition-colors ${
                    tab === t ? "text-[#C9A84C] border-b border-[#C9A84C]" : "text-[#555] hover:text-[#888]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "overview" && (
              <div className="p-5 space-y-4">
                {/* Balance */}
                <div className="text-center">
                  <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">AURUM Coins</p>
                  <p className="font-display text-3xl text-gold-gradient font-semibold">
                    ₳{balance.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-[#444] mt-0.5">
                    Total earned: ₳{totalEarned.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Tier + progress */}
                <div className="border border-[#2a2a2a] rounded-sm p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ color: tier.color }}>{tier.icon}</span>
                      <span className="text-sm text-[#F5F0E8]">{tier.name}</span>
                    </div>
                    <span className="text-[10px] text-[#555]">
                      {streak > 0 ? `🔥 ${streak}-day streak` : "No streak"}
                    </span>
                  </div>
                  {nextTier && (
                    <>
                      <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden mb-1.5">
                        <motion.div
                          animate={{ width: `${tierProgress * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#555]">
                        ₳{(nextTier.minCoins - totalEarned).toLocaleString("en-IN")} to {nextTier.name}
                      </p>
                    </>
                  )}
                  {!nextTier && <p className="text-[10px] text-[#C9A84C]">✦ Maximum tier reached</p>}
                </div>

                {/* Daily claim */}
                {canClaim ? (
                  <button
                    onClick={handleQuickClaim}
                    className="btn-shine w-full py-3 bg-[#C9A84C] text-[#080808] text-xs font-bold tracking-widest uppercase"
                  >
                    🪙 Claim Daily Coins
                  </button>
                ) : (
                  <div className="py-2.5 text-center text-xs text-[#555] border border-[#2a2a2a] rounded-sm">
                    ✓ Claimed today · Come back tomorrow
                  </div>
                )}

                {/* Earn guide */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-[#555] uppercase tracking-widest">How to earn</p>
                  {[
                    { action: "Daily visit", coins: "₳10K–₳50K" },
                    { action: "View a product", coins: "₳100" },
                    { action: "Add to cart", coins: "₳500" },
                    { action: "Complete purchase", coins: "₳5,000" },
                  ].map((e) => (
                    <div key={e.action} className="flex justify-between text-xs">
                      <span className="text-[#888]">{e.action}</span>
                      <span className="text-[#C9A84C]">{e.coins}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "leaderboard" && (
              <div className="p-5">
                <p className="text-[10px] text-[#555] uppercase tracking-widest mb-4">Top Collectors</p>
                <div className="space-y-2">
                  {leaderboardWithYou.map((entry, i) => (
                    <div
                      key={entry.name}
                      className={`flex items-center gap-3 p-2.5 rounded-sm ${
                        entry.isYou ? "border border-[#C9A84C]/40 bg-[#C9A84C]/5" : "border border-[#2a2a2a]"
                      }`}
                    >
                      <span className={`text-xs w-4 text-center ${i < 3 ? "text-[#C9A84C]" : "text-[#444]"}`}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                      </span>
                      <span style={{ color: TIERS[Math.min(entry.tier, TIERS.length - 1)].color }} className="text-sm">
                        {TIERS[Math.min(entry.tier, TIERS.length - 1)].icon.slice(0, 1)}
                      </span>
                      <span className={`flex-1 text-sm ${entry.isYou ? "text-[#C9A84C] font-semibold" : "text-[#888]"}`}>
                        {entry.name}
                      </span>
                      <span className="text-xs text-[#555] font-mono">
                        ₳{entry.coins >= 1_00_000
                          ? `${(entry.coins / 1_00_000).toFixed(1)}L`
                          : entry.coins.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "convert" && (
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Convert Coins → Wallet</p>
                  <p className="font-display text-2xl text-gold-gradient">₳1 = ₹1</p>
                  <p className="text-[10px] text-[#444] mt-0.5">Minimum ₳10,000 per conversion</p>
                </div>
                <div className="border border-[#2a2a2a] rounded-sm p-3 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#555]">Available coins</span>
                    <span className="text-[#C9A84C]">₳{balance.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555]">Wallet balance</span>
                    <span className="text-[#888]">
                      ₹{(walletBalance / 1_00_000).toFixed(1)}L
                    </span>
                  </div>
                </div>

                {/* Convert input */}
                <div>
                  <label className="text-[10px] text-[#555] uppercase tracking-widest block mb-2">
                    Coins to convert
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      placeholder="10000"
                      min={10000}
                      max={balance}
                      className="flex-1 bg-[#111] border border-[#2a2a2a] text-[#F5F0E8] px-3 py-2 text-sm rounded-sm outline-none focus:border-[#C9A84C] transition-colors"
                    />
                    <button
                      onClick={() => setConvertAmount(String(balance))}
                      className="px-3 py-2 text-[10px] border border-[#2a2a2a] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors rounded-sm"
                    >
                      Max
                    </button>
                  </div>
                  {convertAmount && Number(convertAmount) >= 10_000 && (
                    <p className="text-[10px] text-green-400 mt-1">
                      → ₹{Number(convertAmount).toLocaleString("en-IN")} added to wallet
                    </p>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConvert}
                  disabled={!convertAmount || Number(convertAmount) < 10_000 || Number(convertAmount) > balance}
                  className={`btn-shine w-full py-3 text-sm font-semibold tracking-widest uppercase transition-colors ${
                    convertSuccess
                      ? "bg-green-500/10 border border-green-500 text-green-400"
                      : "bg-[#C9A84C] text-[#080808] hover:bg-[#E8D5A3] disabled:opacity-30 disabled:cursor-not-allowed"
                  }`}
                >
                  {convertSuccess ? "✓ Converted!" : "Convert to Wallet"}
                </motion.button>

                {/* Quick convert buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[10_000, 50_000, 1_00_000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setConvertAmount(String(amt))}
                      disabled={balance < amt}
                      className="py-1.5 text-[10px] border border-[#2a2a2a] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors rounded-sm disabled:opacity-20"
                    >
                      ₳{amt >= 1_00_000 ? `${amt / 1_00_000}L` : `${amt / 1_000}K`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

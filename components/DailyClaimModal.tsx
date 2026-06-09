"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoinsStore, selectCanClaim, getStreakReward, TIERS, getTierForCoins } from "@/lib/coins-store";
import { useCoinsToast } from "./CoinsToast";

const STREAK_CALENDAR = [1, 2, 3, 4, 5, 6, 7];

export function DailyClaimModal() {
  const [visible, setVisible] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [newStreak, setNewStreak] = useState(0);

  const { claimDaily, streak, balance, totalEarned } = useCoinsStore();
  const canClaim = useCoinsStore(selectCanClaim);
  const { showToast } = useCoinsToast();
  const tier = getTierForCoins(totalEarned);

  // Show modal once per day on first load (after 1.5s)
  useEffect(() => {
    if (canClaim) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, [canClaim]);

  const handleClaim = () => {
    const result = claimDaily();
    if (!result) return;
    setEarnedCoins(result.coins);
    setNewStreak(result.streak);
    setClaimed(true);
    showToast(result.coins, `Day ${result.streak} streak!`);
  };

  const close = () => setVisible(false);

  const previewStreak = streak + (canClaim ? 1 : 0);

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]"
          />
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="fixed inset-0 z-[91] flex items-end sm:items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-[#0e0e0e] border border-[#C9A84C]/40 rounded-t-2xl sm:rounded-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#8B6914] via-[#E8D5A3] to-[#8B6914]" />

              <div className="p-6">
                {!claimed ? (
                  <>
                    <div className="text-center mb-5">
                      <p className="text-[10px] text-[#C9A84C] tracking-[0.4em] uppercase mb-2">Daily Reward</p>
                      <h2 className="font-display text-3xl text-[#F5F0E8] mb-1">Claim Your Coins</h2>
                      <p className="text-xs text-[#555]">
                        {streak > 0 ? `${streak}-day streak • Come back tomorrow for more` : "Start your streak today"}
                      </p>
                    </div>

                    {/* Streak calendar */}
                    <div className="flex items-center justify-between mb-6 px-1">
                      {STREAK_CALENDAR.map((day) => {
                        const done = day < previewStreak;
                        const today = day === previewStreak;
                        const coins = getStreakReward(day);
                        return (
                          <div key={day} className="flex flex-col items-center gap-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                              done  ? "bg-[#C9A84C] border-[#C9A84C] text-[#080808]" :
                              today ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10" :
                                      "border-[#2a2a2a] text-[#444]"
                            }`}>
                              {done ? "✓" : day}
                            </div>
                            <span className={`text-[8px] ${today ? "text-[#C9A84C]" : "text-[#444]"}`}>
                              ₳{coins >= 1000 ? `${coins/1000}K` : coins}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Today's reward */}
                    <div className="border border-[#C9A84C]/30 rounded-sm p-4 text-center mb-5 bg-[#C9A84C]/5">
                      <p className="text-xs text-[#888] mb-1">Today's reward</p>
                      <p className="font-display text-4xl text-gold-gradient font-semibold">
                        ₳{getStreakReward(previewStreak).toLocaleString("en-IN")}
                      </p>
                      {previewStreak >= 7 && (
                        <p className="text-xs text-[#C9A84C] mt-1">🔥 Max streak bonus!</p>
                      )}
                    </div>

                    {/* Tier badge */}
                    <div className="flex items-center gap-2 mb-5 p-2.5 border border-[#2a2a2a] rounded-sm">
                      <span style={{ color: tier.color }} className="text-lg">{tier.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs text-[#F5F0E8]">{tier.name}</p>
                        <p className="text-[10px] text-[#555]">₳{balance.toLocaleString("en-IN")} coins</p>
                      </div>
                    </div>

                    <button
                      onClick={handleClaim}
                      className="btn-shine w-full py-4 bg-[#C9A84C] text-[#080808] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#E8D5A3] transition-colors"
                    >
                      Claim ₳{getStreakReward(previewStreak).toLocaleString("en-IN")}
                    </button>
                    <button onClick={close} className="w-full py-2 text-xs text-[#444] hover:text-[#888] transition-colors mt-2">
                      Claim later
                    </button>
                  </>
                ) : (
                  <CelebrationView coins={earnedCoins} streak={newStreak} onClose={close} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CelebrationView({ coins, streak, onClose }: { coins: number; streak: number; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
      <motion.div
        animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6 }}
        className="text-5xl mb-4"
      >
        🪙
      </motion.div>
      <p className="text-[10px] text-[#C9A84C] tracking-[0.4em] uppercase mb-2">Coins Claimed!</p>
      <p className="font-display text-5xl text-gold-gradient font-semibold mb-1">
        +₳{coins.toLocaleString("en-IN")}
      </p>
      <p className="text-sm text-[#888] mb-1">Day {streak} streak</p>
      {streak >= 7 && <p className="text-xs text-amber-400 mb-4">🔥 You're on fire!</p>}
      {streak < 7 && (
        <p className="text-xs text-[#555] mb-4">
          Come back tomorrow for ₳{getStreakReward(streak + 1).toLocaleString("en-IN")}
        </p>
      )}
      <button
        onClick={onClose}
        className="btn-shine w-full py-3 bg-[#C9A84C] text-[#080808] text-sm font-semibold tracking-widest uppercase"
      >
        Start Shopping →
      </button>
    </motion.div>
  );
}

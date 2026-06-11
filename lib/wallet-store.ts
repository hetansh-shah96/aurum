import { create } from "zustand";
import { persist } from "zustand/middleware";

const DRIP_MS = 2 * 60 * 60 * 1000; // 2 hours

// Every 2 hours, dripAmount is added up to maxBalance
const TIERS = {
  millionaire: { label: "Crorepati",    maxBalance: 1_00_00_000,   dripAmount: 10_00_000 },   // ₹1Cr max
  "old-money":  { label: "Old Money",   maxBalance: 10_00_00_000,  dripAmount: 1_00_00_000 }, // ₹10Cr max
  billionaire:  { label: "Ambani Mode", maxBalance: 100_00_00_000, dripAmount: 10_00_00_000 },// ₹100Cr max
};

export type Tier = keyof typeof TIERS;

// Player rank — unlocks higher-priced products
export const RANKS = [
  { level: 0, name: "Newcomer",  icon: "○", color: "#666666", threshold: 0,              maxPrice: 5_00_00_000,   nextThreshold: 1_00_00_000 },   // ₹5Cr — unlocks almost everything
  { level: 1, name: "Aspirant",  icon: "◎", color: "#C9A84C", threshold: 1_00_00_000,    maxPrice: 50_00_00_000,  nextThreshold: 10_00_00_000 },  // ₹50Cr
  { level: 2, name: "Collector", icon: "◈", color: "#E8D5A3", threshold: 10_00_00_000,   maxPrice: 500_00_00_000, nextThreshold: 1_00_00_00_000 },// ₹500Cr
  { level: 3, name: "Maison",    icon: "♦", color: "#FFD700", threshold: 1_00_00_00_000, maxPrice: Infinity,      nextThreshold: null },
] as const;

export type Rank = (typeof RANKS)[number];

export function getRankForSpend(lifetimeSpent: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (lifetimeSpent >= RANKS[i].threshold) return RANKS[i];
  }
  return RANKS[0];
}

export function getRequiredRank(price: number): Rank {
  for (const rank of RANKS) {
    if (price <= rank.maxPrice) return rank;
  }
  return RANKS[RANKS.length - 1];
}

function calcDrip(tier: Tier, balance: number, lastReplenishTime: number): { added: number; newLastTime: number } {
  const now = Date.now();
  const elapsed = now - lastReplenishTime;
  const periods = Math.floor(elapsed / DRIP_MS);
  if (periods <= 0) return { added: 0, newLastTime: lastReplenishTime };

  const tierData = TIERS[tier];
  const added = Math.min(tierData.maxBalance - balance, periods * tierData.dripAmount);
  const newLastTime = lastReplenishTime + periods * DRIP_MS;
  return { added: Math.max(0, added), newLastTime };
}

interface WalletStore {
  balance: number;
  tier: Tier;
  spent: number;
  lifetimeSpent: number;
  lastReplenishTime: number;
  initialized: boolean;
  setTier: (tier: Tier) => void;
  deduct: (amount: number) => void;
  refund: (amount: number) => void;
  replenish: () => void;
  checkDrip: () => void;
  setInitialized: () => void;
}

export { TIERS, DRIP_MS };

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      balance: TIERS.millionaire.maxBalance,
      tier: "millionaire",
      spent: 0,
      lifetimeSpent: 0,
      lastReplenishTime: Date.now(),
      initialized: false,

      setTier: (tier) => {
        set({ tier, balance: TIERS[tier].maxBalance, spent: 0, lastReplenishTime: Date.now() });
      },

      deduct: (amount) => {
        const { tier, balance, lastReplenishTime } = get();
        const { added, newLastTime } = calcDrip(tier, balance, lastReplenishTime);
        const afterDrip = balance + added;
        set((s) => ({
          balance: Math.max(0, afterDrip - amount),
          spent: s.spent + amount,
          lifetimeSpent: s.lifetimeSpent + amount,
          lastReplenishTime: newLastTime,
        }));
      },

      refund: (amount) => {
        const { tier, balance } = get();
        const max = TIERS[tier].maxBalance;
        set({ balance: Math.min(max, balance + amount) });
      },

      replenish: () => {
        get().checkDrip();
      },

      checkDrip: () => {
        const { tier, balance, lastReplenishTime } = get();
        const { added, newLastTime } = calcDrip(tier, balance, lastReplenishTime);
        if (added <= 0) return;
        set((s) => ({
          balance: s.balance + added,
          lastReplenishTime: newLastTime,
        }));
      },

      setInitialized: () => set({ initialized: true }),
    }),
    {
      name: "aurum-wallet",
      onRehydrateStorage: () => (state) => {
        if (state && !state.lastReplenishTime) {
          state.lastReplenishTime = Date.now();
        }
      },
    }
  )
);

export const selectPlayerRank = (s: WalletStore) => getRankForSpend(s.lifetimeSpent);

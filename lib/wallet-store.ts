import { create } from "zustand";
import { persist } from "zustand/middleware";

// Lower balances — scarcity creates the game loop
const TIERS = {
  millionaire: { label: "Crorepati",   balance: 5_00_000 },       // ₹5 L
  "old-money":  { label: "Old Money",  balance: 50_00_000 },      // ₹50 L
  billionaire:  { label: "Ambani Mode", balance: 10_00_00_000 },  // ₹10 Cr
};

export type Tier = keyof typeof TIERS;

// Player rank unlocks — based on lifetime spend
export const RANKS = [
  {
    level: 0,
    name: "Newcomer",
    icon: "○",
    color: "#666666",
    threshold: 0,
    maxPrice: 10_00_000,          // can buy items ≤ ₹10L
    nextThreshold: 5_00_000,
  },
  {
    level: 1,
    name: "Aspirant",
    icon: "◎",
    color: "#C9A84C",
    threshold: 5_00_000,          // unlock after spending ₹5L
    maxPrice: 1_00_00_000,        // can buy items ≤ ₹1Cr
    nextThreshold: 50_00_000,
  },
  {
    level: 2,
    name: "Collector",
    icon: "◈",
    color: "#E8D5A3",
    threshold: 50_00_000,         // unlock after spending ₹50L
    maxPrice: 10_00_00_000,       // can buy items ≤ ₹10Cr
    nextThreshold: 5_00_00_000,
  },
  {
    level: 3,
    name: "Maison",
    icon: "♦",
    color: "#FFD700",
    threshold: 5_00_00_000,       // unlock after spending ₹5Cr
    maxPrice: Infinity,
    nextThreshold: null,
  },
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

interface WalletStore {
  balance: number;
  tier: Tier;
  spent: number;
  lifetimeSpent: number;
  initialized: boolean;
  setTier: (tier: Tier) => void;
  deduct: (amount: number) => void;
  replenish: () => void;
  setInitialized: () => void;
}

export { TIERS };

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      balance: TIERS.millionaire.balance,
      tier: "millionaire",
      spent: 0,
      lifetimeSpent: 0,
      initialized: false,

      setTier: (tier) => {
        set({ tier, balance: TIERS[tier].balance, spent: 0 });
      },

      deduct: (amount) => {
        set((s) => ({
          balance: Math.max(0, s.balance - amount),
          spent: s.spent + amount,
          lifetimeSpent: s.lifetimeSpent + amount,
        }));
      },

      replenish: () => {
        const tier = get().tier;
        set({ balance: TIERS[tier].balance, spent: 0 });
      },

      setInitialized: () => set({ initialized: true }),
    }),
    { name: "aurum-wallet" }
  )
);

export const selectPlayerRank = (s: WalletStore) => getRankForSpend(s.lifetimeSpent);

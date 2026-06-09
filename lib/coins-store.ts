import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Tier {
  name: string;
  minCoins: number;
  color: string;
  icon: string;
  perks: string[];
}

export const TIERS: Tier[] = [
  { name: "Bronze Collector",   minCoins: 0,          color: "#CD7F32", icon: "◈",  perks: ["Daily ₳10,000 claim", "₳100 per product view"] },
  { name: "Silver Connoisseur", minCoins: 50_000,     color: "#C0C0C0", icon: "◈◈", perks: ["Daily ₳20,000 claim", "2× streak multiplier"] },
  { name: "Gold Curator",       minCoins: 2_00_000,   color: "#C9A84C", icon: "◈◈◈", perks: ["Daily ₳50,000 claim", "3× streak multiplier", "Exclusive items unlocked"] },
  { name: "Platinum Maison",    minCoins: 10_00_000,  color: "#E8E8F0", icon: "◈◈◈◈", perks: ["Daily ₳1,00,000 claim", "5× streak multiplier", "Private vault access"] },
];

// Coins awarded per streak day (index = streak day - 1, capped at last value)
const STREAK_REWARDS = [10_000, 12_000, 15_000, 20_000, 25_000, 35_000, 50_000];

export function getStreakReward(streak: number): number {
  const idx = Math.min(streak - 1, STREAK_REWARDS.length - 1);
  return STREAK_REWARDS[idx];
}

export function getTierForCoins(totalEarned: number): Tier {
  return [...TIERS].reverse().find((t) => totalEarned >= t.minCoins) ?? TIERS[0];
}

export function getNextTier(totalEarned: number): Tier | null {
  return TIERS.find((t) => t.minCoins > totalEarned) ?? null;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

interface CoinsStore {
  balance: number;
  totalEarned: number;
  streak: number;
  lastClaimDate: string | null;
  viewedToday: string[];    // product IDs viewed this session-day
  lastActivityDate: string | null;

  claimDaily: () => { coins: number; streak: number } | null; // null = already claimed
  earnCoins: (amount: number) => void;
  convertToWallet: (coins: number) => boolean;
  markProductViewed: (productId: string) => number; // returns coins earned (0 if already seen today)
  earnCheckout: () => number;
  earnAddToCart: () => number;
}

export const useCoinsStore = create<CoinsStore>()(
  persist(
    (set, get) => ({
      balance: 0,
      totalEarned: 0,
      streak: 0,
      lastClaimDate: null,
      viewedToday: [],
      lastActivityDate: null,

      claimDaily: () => {
        const today = todayStr();
        const { lastClaimDate, streak } = get();
        if (lastClaimDate === today) return null; // already claimed

        const newStreak = lastClaimDate === yesterdayStr() ? streak + 1 : 1;
        const coins = getStreakReward(newStreak);

        set((s) => ({
          balance: s.balance + coins,
          totalEarned: s.totalEarned + coins,
          streak: newStreak,
          lastClaimDate: today,
          // Reset daily viewed list on new day
          viewedToday: lastClaimDate !== today ? [] : s.viewedToday,
        }));
        return { coins, streak: newStreak };
      },

      earnCoins: (amount) => {
        set((s) => ({ balance: s.balance + amount, totalEarned: s.totalEarned + amount }));
      },

      convertToWallet: (coins) => {
        const { balance } = get();
        if (coins > balance || coins < 10_000) return false;
        set((s) => ({ balance: s.balance - coins }));
        return true;
      },

      markProductViewed: (productId) => {
        const today = todayStr();
        const { viewedToday, lastActivityDate } = get();
        const freshViewedToday = lastActivityDate !== today ? [] : viewedToday;

        if (freshViewedToday.includes(productId) || freshViewedToday.length >= 10) return 0;
        const coins = 100;
        set((s) => ({
          balance: s.balance + coins,
          totalEarned: s.totalEarned + coins,
          viewedToday: [...freshViewedToday, productId],
          lastActivityDate: today,
        }));
        return coins;
      },

      earnAddToCart: () => {
        const coins = 500;
        set((s) => ({ balance: s.balance + coins, totalEarned: s.totalEarned + coins }));
        return coins;
      },

      earnCheckout: () => {
        const coins = 5_000;
        set((s) => ({ balance: s.balance + coins, totalEarned: s.totalEarned + coins }));
        return coins;
      },
    }),
    { name: "aurum-coins" }
  )
);

export const selectCoinTier = (s: CoinsStore) => getTierForCoins(s.totalEarned);
export const selectCanClaim = (s: CoinsStore) => s.lastClaimDate !== todayStr();

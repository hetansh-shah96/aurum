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

const STREAK_REWARDS = [10_000, 12_000, 15_000, 20_000, 25_000, 35_000, 50_000];

export function getStreakReward(streak: number): number {
  return STREAK_REWARDS[Math.min(streak - 1, STREAK_REWARDS.length - 1)];
}

export function getTierForCoins(totalEarned: number): Tier {
  return [...TIERS].reverse().find((t) => totalEarned >= t.minCoins) ?? TIERS[0];
}

export function getNextTier(totalEarned: number): Tier | null {
  return TIERS.find((t) => t.minCoins > totalEarned) ?? null;
}

// Variable reward ranges — unpredictability is the addiction
function rollReward(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function todayStr() { return new Date().toISOString().slice(0, 10); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); }

export interface EarnResult {
  coins: number;
  isBonus: boolean;   // triggered "Lucky!" golden toast
  label: string;
}

interface CoinsStore {
  balance: number;
  totalEarned: number;
  streak: number;
  lastClaimDate: string | null;
  viewedToday: string[];
  lastActivityDate: string | null;

  claimDaily: () => { coins: number; streak: number } | null;
  earnCoins: (amount: number) => void;
  convertToWallet: (coins: number) => boolean;
  markProductViewed: (productId: string) => EarnResult | null;
  earnAddToCart: () => EarnResult;
  earnCheckout: () => EarnResult;
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
        if (lastClaimDate === today) return null;
        const newStreak = lastClaimDate === yesterdayStr() ? streak + 1 : 1;
        const coins = getStreakReward(newStreak);
        set((s) => ({
          balance: s.balance + coins,
          totalEarned: s.totalEarned + coins,
          streak: newStreak,
          lastClaimDate: today,
          viewedToday: lastClaimDate !== today ? [] : s.viewedToday,
        }));
        return { coins, streak: newStreak };
      },

      earnCoins: (amount) => {
        set((s) => ({ balance: s.balance + amount, totalEarned: s.totalEarned + amount }));
      },

      convertToWallet: (coins) => {
        if (coins > get().balance || coins < 10_000) return false;
        set((s) => ({ balance: s.balance - coins }));
        return true;
      },

      markProductViewed: (productId) => {
        const today = todayStr();
        const { viewedToday, lastActivityDate } = get();
        const fresh = lastActivityDate !== today ? [] : viewedToday;
        if (fresh.includes(productId) || fresh.length >= 10) return null;

        // Variable: ₳50-₳400, 3% chance of ₳1,000 "Hot Pick!"
        const isBonus = Math.random() < 0.03;
        const coins = isBonus ? 1_000 : rollReward(50, 400);
        set((s) => ({
          balance: s.balance + coins,
          totalEarned: s.totalEarned + coins,
          viewedToday: [...fresh, productId],
          lastActivityDate: today,
        }));
        return { coins, isBonus, label: isBonus ? "Hot Pick! 🔥" : "product viewed" };
      },

      earnAddToCart: () => {
        // Variable: ₳200-₳2,000, 5% chance of ₳5,000 "Lucky Cart! 🎰"
        const isBonus = Math.random() < 0.05;
        const coins = isBonus ? 5_000 : rollReward(200, 2_000);
        set((s) => ({ balance: s.balance + coins, totalEarned: s.totalEarned + coins }));
        return { coins, isBonus, label: isBonus ? "Lucky Cart! 🎰" : "added to cart" };
      },

      earnCheckout: () => {
        // Variable: ₳2,000-₳10,000, 5% chance of ₳25,000 "Legendary Purchase! 👑"
        const isBonus = Math.random() < 0.05;
        const coins = isBonus ? 25_000 : rollReward(2_000, 10_000);
        set((s) => ({ balance: s.balance + coins, totalEarned: s.totalEarned + coins }));
        return { coins, isBonus, label: isBonus ? "Legendary Purchase! 👑" : "purchase complete" };
      },
    }),
    { name: "aurum-coins" }
  )
);

export const selectCoinTier = (s: CoinsStore) => getTierForCoins(s.totalEarned);
export const selectCanClaim = (s: CoinsStore) => s.lastClaimDate !== todayStr();

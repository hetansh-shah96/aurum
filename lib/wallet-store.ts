import { create } from "zustand";
import { persist } from "zustand/middleware";

// Wallet balances in INR
const TIERS = {
  millionaire: { label: "Crorepati", balance: 5_00_00_000 },       // ₹5 Cr
  "old-money": { label: "Old Money", balance: 50_00_00_000 },      // ₹50 Cr
  billionaire: { label: "Ambani Mode", balance: 1000_00_00_000 },  // ₹1000 Cr
};

export type Tier = keyof typeof TIERS;

interface WalletStore {
  balance: number;
  tier: Tier;
  spent: number;
  setTier: (tier: Tier) => void;
  deduct: (amount: number) => void;
  replenish: () => void;
  initialized: boolean;
  setInitialized: () => void;
}

export { TIERS };

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      balance: TIERS.millionaire.balance,
      tier: "millionaire",
      spent: 0,
      initialized: false,

      setTier: (tier) => {
        set({ tier, balance: TIERS[tier].balance, spent: 0 });
      },

      deduct: (amount) => {
        set((s) => ({
          balance: Math.max(0, s.balance - amount),
          spent: s.spent + amount,
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

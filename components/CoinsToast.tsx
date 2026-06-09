"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Toast { id: number; coins: number; label: string; isBonus: boolean }
interface ToastCtx { showToast: (coins: number, label: string, isBonus?: boolean) => void }

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

export function useCoinsToast() {
  return useContext(ToastContext);
}

export function CoinsToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((coins: number, label: string, isBonus = false) => {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, coins, label, isBonus }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), isBonus ? 4000 : 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: t.isBonus ? [1, 1.08, 1] : 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 shadow-xl border ${
                t.isBonus
                  ? "bg-[#1a1200] border-amber-400/60 shadow-amber-400/20"
                  : "bg-[#111] border-[#C9A84C]/40"
              }`}
            >
              {t.isBonus && (
                <motion.span
                  animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-base"
                >
                  ✨
                </motion.span>
              )}
              <span className={`font-bold text-sm ${t.isBonus ? "text-amber-400" : "text-[#C9A84C]"}`}>
                +₳{t.coins.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-[#888]">{t.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

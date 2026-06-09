"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Toast { id: number; coins: number; label: string }

interface ToastCtx { showToast: (coins: number, label: string) => void }

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

export function useCoinsToast() {
  return useContext(ToastContext);
}

export function CoinsToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((coins: number, label: string) => {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, coins, label }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500);
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
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-2 bg-[#111] border border-[#C9A84C]/40 rounded-full px-4 py-2 shadow-lg"
            >
              <span className="text-[#C9A84C] font-bold text-sm">+₳{t.coins.toLocaleString("en-IN")}</span>
              <span className="text-[#888] text-xs">{t.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

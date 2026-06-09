"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useWalletStore } from "@/lib/wallet-store";
import { formatPrice } from "@/lib/products";

const ORDER_ID = () => `AUR-${Math.floor(Math.random() * 9000) + 1000}-${Date.now().toString(36).toUpperCase().slice(-4)}`;

const DELIVERY_STEPS = [
  { label: "Order Received", time: "Just now", done: true },
  { label: "Authentication & Verification", time: "In 2 minutes", done: false },
  { label: "Assigned to Concierge Team", time: "In 15 minutes", done: false },
  { label: "White-Glove Packaging", time: "Within 2 hours", done: false },
  { label: "Private Courier Dispatch", time: "Today", done: false },
  { label: "Delivered to Your Estate", time: "Tomorrow, before noon", done: false },
];

const COURIER_MESSAGES = [
  "Your concierge team has been notified.",
  "Packaging materials selected — finest silk and velvet.",
  "Authentication certificate being prepared.",
  "Private courier en route to our vault.",
  "Your items are being wrapped with care.",
  "Almost ready — your satisfaction is our priority.",
];

export default function OrderConfirmedPage() {
  const [orderId] = useState(ORDER_ID);
  const [steps, setSteps] = useState(DELIVERY_STEPS);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const fired = useRef(false);
  const { replenish, spent } = useWalletStore();

  // Confetti burst on mount
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const colors = ["#C9A84C", "#E8D5A3", "#F5F0E8", "#8B6914", "#ffffff"];

    const burst = () => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.4, x: 0.3 },
        colors,
        shapes: ["square"],
        scalar: 0.9,
      });
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.4, x: 0.7 },
        colors,
        shapes: ["square"],
        scalar: 0.9,
      });
    };

    burst();
    // Replenish wallet after "spending"
    setTimeout(() => replenish(), 4000);

    setTimeout(burst, 600);
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.5 },
        colors,
        scalar: 1.2,
        startVelocity: 40,
      });
    }, 1200);
  }, []);

  // Animate delivery steps
  useEffect(() => {
    let idx = 1;
    const interval = setInterval(() => {
      if (idx >= steps.length) {
        clearInterval(interval);
        return;
      }
      setSteps((prev) =>
        prev.map((s, i) => (i === idx ? { ...s, done: true } : s))
      );
      setProgressPct(Math.round((idx / (steps.length - 1)) * 100));
      idx++;
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Rotate courier messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsg((m) => (m + 1) % COURIER_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success banner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-7xl mb-6"
          >
            ✨
          </motion.div>
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">Order Confirmed</p>
          <h1 className="font-display text-5xl md:text-6xl text-[#F5F0E8] mb-4">
            It's all yours.
          </h1>
          <p className="text-[#888] text-lg leading-relaxed mb-2">
            Your collection has been secured. Enjoy the feeling.
          </p>
          <p className="text-[#444] text-sm">
            (Reminder: nothing is actually being shipped — but you knew that.)
          </p>
        </motion.div>

        {/* Order ID card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-[#C9A84C]/40 rounded-sm p-6 mb-6 bg-[#0e0e0e] gold-glow"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-[#555] tracking-widest uppercase">Order Reference</p>
              <p className="font-mono text-xl text-[#C9A84C] mt-1">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#555] tracking-widest uppercase">Estimated Delivery</p>
              <p className="text-sm text-[#F5F0E8] mt-1">Tomorrow, before noon</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-green-500/5 border border-green-500/20 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-gold" />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentMsg}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-green-400/80"
              >
                {COURIER_MESSAGES[currentMsg]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Live tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border border-[#2a2a2a] rounded-sm p-6 mb-6 bg-[#0e0e0e]"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#F5F0E8] font-medium tracking-wider">Live Delivery Tracking</p>
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-gold" />
              Live
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-[#2a2a2a] rounded-full mb-6 overflow-hidden">
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#8B6914] to-[#C9A84C] rounded-full"
            />
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                animate={{ opacity: step.done ? 1 : 0.35 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <AnimatePresence mode="wait">
                    {step.done ? (
                      <motion.div
                        key="done"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-[#080808]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pending"
                        className="w-5 h-5 rounded-full border border-[#2a2a2a]"
                      />
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className={`text-sm transition-colors ${step.done ? "text-[#F5F0E8]" : "text-[#444]"}`}>
                    {step.label}
                  </span>
                  <span className={`text-xs transition-colors ${step.done ? "text-[#C9A84C]" : "text-[#333]"}`}>
                    {step.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certificate button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowCertificate(!showCertificate)}
            className="w-full py-3 border border-[#C9A84C]/40 text-[#C9A84C] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C]/5 transition-colors rounded-sm"
          >
            {showCertificate ? "Hide" : "View"} Luxury Acquisition Certificate ◈
          </button>
        </motion.div>

        {/* Certificate */}
        <AnimatePresence>
          {showCertificate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="border-2 border-[#C9A84C]/40 rounded-sm p-8 bg-gradient-to-b from-[#0e0e0e] to-[#080808] text-center gold-glow-strong">
                <div className="border border-[#C9A84C]/20 p-6">
                  <p className="text-[#C9A84C] text-xs tracking-[0.5em] uppercase mb-2">Certificate of Acquisition</p>
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-4" />
                  <h2 className="font-display text-3xl text-[#F5F0E8] mb-2">AURUM</h2>
                  <p className="text-xs text-[#555] mb-6 tracking-widest">LUXURY WITHOUT LIMITS</p>
                  <p className="text-sm text-[#888] mb-2">This certifies that the bearer has successfully</p>
                  <p className="font-display text-xl text-[#C9A84C] mb-2">indulged in the finest things in life</p>
                  <p className="text-sm text-[#888] mb-6">without spending a single cent.</p>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-4" />
                  <p className="font-mono text-xs text-[#555] mb-1">{orderId}</p>
                  <p className="text-[10px] text-[#333] tracking-widest uppercase">Issued {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  <div className="mt-6 text-[#C9A84C]/30 text-4xl">◈</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/shop"
            className="btn-shine flex-1 py-4 bg-[#C9A84C] text-[#080808] text-sm font-semibold tracking-[0.2em] uppercase text-center hover:bg-[#E8D5A3] transition-colors"
          >
            Shop Again
          </Link>
          <Link
            href="/"
            className="flex-1 py-4 border border-[#2a2a2a] text-[#888] text-sm tracking-[0.2em] uppercase text-center hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>

        {/* Share nudge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-xs text-[#333] mt-8 tracking-wide"
        >
          {spent > 0
            ? `You've virtually spent ${formatPrice(spent)} on the finer things in life. Treat yourself.`
            : "Your wallet has been replenished. Go again!"}
          <span className="block text-[#444] mt-1">Wallet replenished — ready for your next spree.</span>
        </motion.p>
      </div>
    </div>
  );
}


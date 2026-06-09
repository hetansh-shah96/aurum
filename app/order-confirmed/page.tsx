"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useWalletStore } from "@/lib/wallet-store";
import { useCoinsStore } from "@/lib/coins-store";
import { CursedModal } from "@/components/CursedModal";
import { useCoinsToast } from "@/components/CoinsToast";
import { formatPrice } from "@/lib/products";

const ORDER_ID = () =>
  `AUR-${Math.floor(Math.random() * 9000) + 1000}-${Date.now().toString(36).toUpperCase().slice(-5)}`;

const TRACKING_ID = () =>
  `BD${Math.floor(Math.random() * 90000000) + 10000000}IN`;

// Compute realistic delivery dates
function getDeliveryDates() {
  const now = new Date();
  const day1 = new Date(now);
  day1.setDate(now.getDate() + 1);
  const day2 = new Date(now);
  day2.setDate(now.getDate() + 2);

  const fmt = (d: Date, time?: string) => {
    const dayStr = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
    return time ? `${dayStr}, ${time}` : dayStr;
  };

  return {
    today: fmt(now),
    tomorrow: fmt(day1),
    dayAfter: fmt(day2),
    deliveryWindow: fmt(day2, "10 AM – 8 PM"),
    confirmationDate: now.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
  };
}

const COURIER_MESSAGES = [
  "Your concierge team has been notified.",
  "Premium packaging materials selected — silk-lined box.",
  "Authentication certificate being prepared.",
  "BlueDart Premium courier assigned.",
  "Items undergoing quality inspection.",
  "White-glove packaging in progress.",
  "Courier pickup scheduled for tomorrow morning.",
  "Your order is sealed and ready for dispatch.",
];

export default function OrderConfirmedPage() {
  const [orderId] = useState(ORDER_ID);
  const [trackingId] = useState(TRACKING_ID);
  const dates = useRef(getDeliveryDates()).current;

  const DELIVERY_STEPS = [
    { label: "Order Confirmed", detail: `Today, ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`, done: true },
    { label: "Payment Verified", detail: "Today, within 5 minutes", done: false },
    { label: "Quality Check & Packaging", detail: `${dates.today}, by 6 PM`, done: false },
    { label: "Dispatched via BlueDart Premium", detail: `${dates.tomorrow}, 9 AM`, done: false },
    { label: "Out for Delivery", detail: `${dates.dayAfter}, 10 AM`, done: false },
    { label: "Delivered to Your Address", detail: dates.deliveryWindow, done: false },
  ];

  const [steps, setSteps] = useState(DELIVERY_STEPS);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [notifStatus, setNotifStatus] = useState<"idle" | "granted" | "denied">("idle");
  const fired = useRef(false);
  const { replenish, spent } = useWalletStore();
  const { earnCheckout, balance: coinBalance } = useCoinsStore();
  const { showToast } = useCoinsToast();
  const [cursedProductId, setCursedProductId] = useState<string | null>(null);

  // Confetti on mount
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const colors = ["#C9A84C", "#E8D5A3", "#F5F0E8", "#8B6914", "#ffffff"];
    const burst = () => {
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.4, x: 0.3 }, colors, shapes: ["square"], scalar: 0.9 });
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.4, x: 0.7 }, colors, shapes: ["square"], scalar: 0.9 });
    };
    burst();
    setTimeout(burst, 600);
    setTimeout(() => {
      confetti({ particleCount: 200, spread: 160, origin: { y: 0.5 }, colors, scalar: 1.2, startVelocity: 40 });
    }, 1200);

    // Replenish wallet after "spending"
    setTimeout(() => replenish(), 5000);
    const result = earnCheckout();
    showToast(result.coins, result.label, result.isBonus);

    // Check for cursed items via URL
    const params = new URLSearchParams(window.location.search);
    const cursed = params.get("cursed");
    if (cursed) {
      setTimeout(() => {
        setCursedProductId(cursed);
        // Drain all coins after showing the modal
        useCoinsStore.setState({ balance: 0 });
      }, 3500);
    }
  }, [replenish, earnCheckout, showToast]);

  // Animate delivery steps (1 per 2s for demo feel)
  useEffect(() => {
    let idx = 1;
    const interval = setInterval(() => {
      if (idx >= steps.length) { clearInterval(interval); return; }
      setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, done: true } : s)));
      setProgressPct(Math.round((idx / (steps.length - 1)) * 100));
      idx++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Rotate courier messages
  useEffect(() => {
    const interval = setInterval(() => setCurrentMsg((m) => (m + 1) % COURIER_MESSAGES.length), 3500);
    return () => clearInterval(interval);
  }, []);

  // Request push notification permission & schedule reminders
  const requestNotifications = async () => {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifStatus(perm === "granted" ? "granted" : "denied");

    if (perm === "granted") {
      // Immediate order confirmation notification
      new Notification("AURUM — Order Confirmed! ✨", {
        body: `Your order ${orderId} is confirmed. Arriving ${dates.deliveryWindow}.`,
        icon: "/favicon.ico",
        tag: "order-confirmed",
      });

      // "Out for delivery" reminder — in demo fires after 15s; in real app this would be day 2
      const dispatchTimer = setTimeout(() => {
        new Notification("AURUM — Your Parcel is On the Way! 📦", {
          body: `Your BlueDart courier is out for delivery today. Expected by 8 PM. Tracking: ${trackingId}`,
          icon: "/favicon.ico",
          tag: "out-for-delivery",
        });
      }, 15_000);

      // "Ready for pickup / delivery imminent" — fires after 30s in demo
      const deliveryTimer = setTimeout(() => {
        new Notification("AURUM — Parcel Arriving Soon! 🚚", {
          body: "Your delivery agent is 2 stops away. Please be available. Tap to track.",
          icon: "/favicon.ico",
          tag: "arriving-now",
          requireInteraction: true,
        });
      }, 30_000);

      // Store timers so component cleanup can cancel (best effort)
      return () => { clearTimeout(dispatchTimer); clearTimeout(deliveryTimer); };
    }
  };

  return (
    <>
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success banner */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-6xl mb-5"
          >
            ✨
          </motion.div>
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">Order Confirmed</p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#F5F0E8] mb-4">It's all yours.</h1>
          <p className="text-[#888] text-base sm:text-lg leading-relaxed mb-2">
            Your collection has been secured. Sit back and enjoy the feeling.
          </p>
          <p className="text-[#444] text-xs sm:text-sm">
            (Reminder: nothing is actually being shipped — but you knew that.)
          </p>
        </motion.div>

        {/* Order ID + tracking card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-[#C9A84C]/40 rounded-sm p-5 sm:p-6 mb-6 bg-[#0e0e0e] gold-glow"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-[10px] text-[#555] tracking-widest uppercase mb-1">Order Reference</p>
              <p className="font-mono text-sm sm:text-base text-[#C9A84C]">{orderId}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#555] tracking-widest uppercase mb-1">Tracking ID</p>
              <p className="font-mono text-sm text-[#888]">{trackingId}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#555] tracking-widest uppercase mb-1">Courier</p>
              <p className="text-sm text-[#F5F0E8]">BlueDart Premium</p>
            </div>
            <div>
              <p className="text-[10px] text-[#555] tracking-widest uppercase mb-1">Expected Delivery</p>
              <p className="text-sm text-[#F5F0E8] font-medium">{dates.deliveryWindow}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-green-500/5 border border-green-500/20 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 pulse-gold" />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentMsg}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-xs text-green-400/80"
              >
                {COURIER_MESSAGES[currentMsg]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Push notification CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          {notifStatus === "idle" && (
            <button
              onClick={requestNotifications}
              className="w-full flex items-center justify-between gap-3 p-4 border border-[#C9A84C]/30 bg-[#0e0e0e] hover:border-[#C9A84C]/60 transition-colors rounded-sm group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>
                <div className="text-left">
                  <p className="text-sm text-[#F5F0E8] font-medium">Get delivery alerts</p>
                  <p className="text-xs text-[#555]">We'll notify you when your parcel is out for delivery & arriving</p>
                </div>
              </div>
              <span className="text-[#C9A84C] text-xs tracking-widest uppercase group-hover:underline flex-shrink-0">Enable →</span>
            </button>
          )}
          {notifStatus === "granted" && (
            <div className="flex items-center gap-3 p-4 border border-green-500/30 bg-green-500/5 rounded-sm">
              <span className="text-xl">✅</span>
              <div>
                <p className="text-sm text-green-400 font-medium">Notifications enabled</p>
                <p className="text-xs text-[#555]">You'll receive alerts when your parcel is out for delivery. Check in ~15 seconds for a demo.</p>
              </div>
            </div>
          )}
          {notifStatus === "denied" && (
            <div className="flex items-center gap-3 p-4 border border-[#2a2a2a] rounded-sm">
              <span className="text-xl">🔕</span>
              <p className="text-xs text-[#555]">Notifications blocked. Enable them in your browser settings to receive delivery alerts.</p>
            </div>
          )}
        </motion.div>

        {/* Live delivery tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="border border-[#2a2a2a] rounded-sm p-5 sm:p-6 mb-6 bg-[#0e0e0e]"
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
              <motion.div key={step.label} animate={{ opacity: step.done ? 1 : 0.3 }} className="flex items-start gap-4">
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
                      <div className="w-5 h-5 rounded-full border border-[#2a2a2a]" />
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                  <span className={`text-sm transition-colors ${step.done ? "text-[#F5F0E8]" : "text-[#444]"}`}>
                    {step.label}
                  </span>
                  <span className={`text-xs transition-colors ${step.done ? "text-[#C9A84C]" : "text-[#333]"}`}>
                    {step.detail}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-[#2a2a2a] flex items-center justify-between text-xs text-[#444]">
            <span>Courier: BlueDart Premium Express</span>
            <span className="font-mono text-[#555]">{trackingId}</span>
          </div>
        </motion.div>

        {/* Certificate button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mb-5">
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
              className="overflow-hidden mb-6"
            >
              <div className="border-2 border-[#C9A84C]/40 rounded-sm p-6 sm:p-8 bg-gradient-to-b from-[#0e0e0e] to-[#080808] text-center gold-glow-strong">
                <div className="border border-[#C9A84C]/20 p-5 sm:p-6">
                  <p className="text-[#C9A84C] text-xs tracking-[0.5em] uppercase mb-2">Certificate of Acquisition</p>
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-4" />
                  <h2 className="font-display text-3xl text-[#F5F0E8] mb-1">AURUM</h2>
                  <p className="text-xs text-[#555] mb-6 tracking-widest">LUXURY WITHOUT LIMITS</p>
                  <p className="text-sm text-[#888] mb-2">This certifies that the bearer has successfully</p>
                  <p className="font-display text-xl text-[#C9A84C] mb-2">indulged in the finest things in life</p>
                  <p className="text-sm text-[#888] mb-6">without spending a single rupee.</p>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-4" />
                  <p className="font-mono text-xs text-[#555] mb-1">{orderId}</p>
                  <p className="text-[10px] text-[#333] tracking-widest uppercase">Issued {dates.confirmationDate}</p>
                  <div className="mt-5 text-[#C9A84C]/30 text-4xl">◈</div>
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
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-xs text-[#333] mt-8 tracking-wide"
        >
          {spent > 0
            ? `You've virtually spent ${formatPrice(spent)} on the finer things in life. Wallet replenished — go again!`
            : "Your wallet has been replenished. Go again!"}
        </motion.p>
      </div>
    </div>

    <CursedModal
      productId={cursedProductId}
      onClose={() => setCursedProductId(null)}
    />
    </>
  );
}

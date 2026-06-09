"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, selectTotalPrice } from "@/lib/cart-store";
import { useWalletStore, TIERS } from "@/lib/wallet-store";
import { useCoinsStore } from "@/lib/coins-store";
import { formatPrice } from "@/lib/products";

type Step = "details" | "payment" | "confirm";

const STEPS: Step[] = ["details", "payment", "confirm"];
const STEP_LABELS = { details: "Delivery Details", payment: "Payment", confirm: "Review" };

const CARD_FORMATS = [
  "4532 •••• •••• 7841",
  "5412 •••• •••• 2290",
  "3782 •••••• •1005",
  "4916 •••• •••• 5543",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const totalPrice = useCartStore(selectTotalPrice);
  const { balance: walletBalance, deduct, setTier } = useWalletStore();
  const { balance: coins, convertToWallet } = useCoinsStore();
  const [step, setStep] = useState<Step>("details");
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "India",
    card: CARD_FORMATS[Math.floor(Math.random() * CARD_FORMATS.length)],
    expiry: "12/28",
    cvv: "•••",
  });

  const handleNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const handlePay = () => {
    setProcessing(true);
    deduct(totalPrice);
    const cursedItem = items.find((i) => i.product.cursed);
    setTimeout(() => {
      clearCart();
      const base = `/order-confirmed?amount=${totalPrice}`;
      router.push(cursedItem ? `${base}&cursed=${cursedItem.product.id}` : base);
    }, 2800);
  };

  const currentIdx = STEPS.indexOf(step);

  if (items.length === 0 && !processing) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-[#555]">Your cart is empty.</p>
        <a href="/shop" className="text-[#C9A84C] underline underline-offset-4 text-sm">Browse the collection</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-2">Acquisition</p>
          <h1 className="font-display text-4xl text-[#F5F0E8]">Secure Your Collection</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8 sm:mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 text-xs tracking-widest uppercase transition-all ${
                  s === step ? "text-[#C9A84C]" : currentIdx > i ? "text-[#888]" : "text-[#333]"
                }`}
              >
                <span
                  className={`w-6 h-6 sm:w-5 sm:h-5 rounded-full border text-xs flex items-center justify-center font-bold transition-all flex-shrink-0 ${
                    currentIdx > i
                      ? "border-[#C9A84C] bg-[#C9A84C] text-[#080808]"
                      : s === step
                      ? "border-[#C9A84C] text-[#C9A84C]"
                      : "border-[#333] text-[#333]"
                  }`}
                >
                  {currentIdx > i ? "✓" : i + 1}
                </span>
                {/* Labels hidden on mobile, shown sm+ */}
                <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 sm:w-12 h-px transition-colors ${currentIdx > i ? "bg-[#C9A84C]" : "bg-[#2a2a2a]"}`} />
              )}
            </div>
          ))}
          {/* Mobile: show current step label below */}
          <div className="sm:hidden absolute mt-14 text-xs text-[#C9A84C] tracking-widest uppercase">
            {STEP_LABELS[step]}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border border-[#2a2a2a] rounded-sm p-6 space-y-4">
                    <h2 className="font-display text-xl text-[#F5F0E8] mb-4">Delivery Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Full Name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(v) => setFormData({ ...formData, name: v })}
                      />
                      <InputField
                        label="Email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(v) => setFormData({ ...formData, email: v })}
                      />
                    </div>
                    <InputField
                      label="Delivery Address"
                      placeholder="123 Luxury Avenue, Penthouse"
                      value={formData.address}
                      onChange={(v) => setFormData({ ...formData, address: v })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="City"
                        placeholder="Monaco"
                        value={formData.city}
                        onChange={(v) => setFormData({ ...formData, city: v })}
                      />
                      <div>
                        <label className="text-xs text-[#555] tracking-widest uppercase block mb-2">Country</label>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full bg-[#111] border border-[#2a2a2a] text-[#F5F0E8] px-4 py-3 text-sm rounded-sm outline-none focus:border-[#C9A84C] transition-colors"
                        >
                          {["India", "United States", "United Kingdom", "UAE", "Singapore", "Monaco", "Switzerland", "France", "Japan", "Australia", "Canada"].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="btn-shine w-full py-4 bg-[#C9A84C] text-[#080808] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#E8D5A3] transition-colors"
                  >
                    Continue to Payment →
                  </button>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border border-[#2a2a2a] rounded-sm p-6 space-y-5">
                    <h2 className="font-display text-xl text-[#F5F0E8] mb-2">Payment Details</h2>
                    <p className="text-xs text-[#555]">Your payment information is simulated. No actual charges will be made.</p>

                    {/* Fake card display */}
                    <div className="relative h-44 rounded-lg bg-gradient-to-br from-[#1a1a1a] to-[#2a2016] border border-[#C9A84C]/20 p-6 overflow-hidden">
                      <div className="absolute inset-0 opacity-5"
                        style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #C9A84C 0%, transparent 60%)" }}
                      />
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="font-display text-xl tracking-[0.3em] text-[#C9A84C]">AURUM</span>
                          <span className="text-2xl">◈</span>
                        </div>
                        <div>
                          <p className="font-mono text-lg text-[#F5F0E8] tracking-wider mb-2">{formData.card}</p>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[9px] text-[#555] uppercase tracking-widest">Card Holder</p>
                              <p className="text-sm text-[#F5F0E8]">{formData.name || "Your Name"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-[#555] uppercase tracking-widest">Expires</p>
                              <p className="text-sm text-[#F5F0E8]">{formData.expiry}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs text-[#555] tracking-widest uppercase block mb-2">Card Number</label>
                        <div className="bg-[#111] border border-[#2a2a2a] px-4 py-3 text-sm font-mono text-[#888] rounded-sm">
                          {formData.card}
                        </div>
                      </div>
                      <InputField label="CVV" value={formData.cvv} onChange={() => {}} placeholder="•••" />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/20 rounded-sm">
                      <span className="text-green-400 text-sm">🔒</span>
                      <span className="text-xs text-green-400/80">256-bit SSL encrypted · No real charges ever</span>
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="btn-shine w-full py-4 bg-[#C9A84C] text-[#080808] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#E8D5A3] transition-colors"
                  >
                    Review Order →
                  </button>
                </motion.div>
              )}

              {step === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border border-[#C9A84C]/30 rounded-sm p-6 bg-[#0e0e0e]">
                    <h2 className="font-display text-xl text-[#F5F0E8] mb-6">Order Review</h2>
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-sm overflow-hidden flex-shrink-0">
                            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-[#C9A84C]">{item.product.brand}</p>
                            <p className="text-sm text-[#F5F0E8]">{item.product.name}</p>
                            <p className="text-xs text-[#555]">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-display text-gold-gradient">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-[#2a2a2a] pt-4 space-y-2">
                      <div className="flex justify-between text-xs text-[#555]">
                        <span>White-glove delivery</span>
                        <span className="text-green-400">Complimentary</span>
                      </div>
                      <div className="flex justify-between text-xs text-[#555]">
                        <span>Insurance & handling</span>
                        <span className="text-green-400">Included</span>
                      </div>
                      <div className="flex justify-between mt-3 pt-3 border-t border-[#2a2a2a]">
                        <span className="text-sm text-[#888]">Total</span>
                        <span className="font-display text-xl text-gold-gradient">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  {walletBalance < totalPrice ? (
                    <WalletGate
                      walletBalance={walletBalance}
                      totalPrice={totalPrice}
                      coins={coins}
                      onConvert={(amount) => {
                        convertToWallet(amount);
                        useWalletStore.setState((s) => ({ balance: s.balance + amount }));
                      }}
                      onUpgradeTier={setTier}
                    />
                  ) : (
                    <>
                      <motion.button
                        onClick={handlePay}
                        disabled={processing}
                        whileTap={{ scale: 0.97 }}
                        className="btn-shine relative w-full py-5 bg-[#C9A84C] text-[#080808] text-sm font-semibold tracking-[0.2em] uppercase overflow-hidden"
                      >
                        <AnimatePresence mode="wait">
                          {processing ? (
                            <motion.span
                              key="processing"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center justify-center gap-3"
                            >
                              <ProcessingDots />
                              Processing your acquisition...
                            </motion.span>
                          ) : (
                            <motion.span key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              Complete Acquisition · {formatPrice(totalPrice)}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                      <p className="text-center text-xs text-[#444]">
                        No real payment · Pure simulation · 100% free dopamine
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <div className="hidden lg:block">
            <div className="border border-[#2a2a2a] rounded-sm p-5 sticky top-24">
              <p className="text-xs text-[#555] tracking-widest uppercase mb-4">Your Curation</p>
              <div className="space-y-3 mb-5">
                {items.slice(0, 4).map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-sm overflow-hidden flex-shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#888] truncate">{item.product.name}</p>
                      <p className="text-xs text-[#C9A84C]">{formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#2a2a2a] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#555] tracking-widest uppercase">Total</span>
                  <span className="font-display text-lg text-gold-gradient">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label, placeholder, value, onChange,
}: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-[#555] tracking-widest uppercase block mb-2">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#111] border border-[#2a2a2a] text-[#F5F0E8] px-4 py-3 text-sm rounded-sm outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#333]"
      />
    </div>
  );
}

function WalletGate({
  walletBalance, totalPrice, coins, onConvert, onUpgradeTier,
}: {
  walletBalance: number;
  totalPrice: number;
  coins: number;
  onConvert: (amount: number) => void;
  onUpgradeTier: (tier: "millionaire" | "old-money" | "billionaire") => void;
}) {
  const shortfall = totalPrice - walletBalance;
  const canConvert = coins >= 10_000;
  const maxConvert = Math.min(coins, shortfall + 10_000);
  const [converting, setConverting] = useState(false);

  const handleConvert = () => {
    if (!canConvert) return;
    const amt = Math.min(coins, Math.ceil(shortfall / 10_000) * 10_000);
    onConvert(amt);
    setConverting(true);
    setTimeout(() => setConverting(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-amber-500/30 rounded-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-amber-500/5 px-5 py-4 border-b border-amber-500/20 flex items-center gap-3">
        <span className="text-2xl">🔒</span>
        <div>
          <p className="text-sm font-semibold text-amber-400">Wallet Balance Insufficient</p>
          <p className="text-xs text-[#555] mt-0.5">
            You need {formatPrice(shortfall)} more to complete this acquisition
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Balance vs needed */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="border border-[#2a2a2a] rounded-sm p-3">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Your Balance</p>
            <p className="font-display text-lg text-[#888]">{formatPrice(walletBalance)}</p>
          </div>
          <div className="border border-red-500/30 rounded-sm p-3 bg-red-500/5">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Cart Total</p>
            <p className="font-display text-lg text-red-400">{formatPrice(totalPrice)}</p>
          </div>
        </div>

        {/* Option 1: Convert coins */}
        <div className="border border-[#2a2a2a] rounded-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-[#F5F0E8]">Convert AURUM Coins</p>
            <span className="text-xs text-[#C9A84C]">₳{coins.toLocaleString("en-IN")}</span>
          </div>
          {canConvert ? (
            <button
              onClick={handleConvert}
              className={`btn-shine w-full py-2.5 text-xs font-semibold tracking-widest uppercase transition-colors ${
                converting
                  ? "bg-green-500/10 border border-green-500 text-green-400"
                  : "bg-[#C9A84C] text-[#080808] hover:bg-[#E8D5A3]"
              }`}
            >
              {converting ? "✓ Coins Added to Wallet!" : `Convert ₳${Math.min(coins, Math.ceil(shortfall / 10_000) * 10_000).toLocaleString("en-IN")} → ${formatPrice(Math.min(coins, Math.ceil(shortfall / 10_000) * 10_000))}`}
            </button>
          ) : (
            <div className="text-center py-2.5 border border-[#2a2a2a] rounded-sm">
              <p className="text-xs text-[#555]">Not enough coins (min ₳10,000)</p>
              <p className="text-[10px] text-[#444] mt-0.5">Claim your daily reward to earn more →</p>
            </div>
          )}
        </div>

        {/* Option 2: Upgrade wallet tier */}
        <div className="border border-[#2a2a2a] rounded-sm p-4">
          <p className="text-xs font-semibold text-[#F5F0E8] mb-3">Or upgrade your wallet tier</p>
          <div className="space-y-2">
            {(Object.entries(TIERS) as [keyof typeof TIERS, typeof TIERS[keyof typeof TIERS]][])
              .filter(([, t]) => t.maxBalance > walletBalance)
              .map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => onUpgradeTier(key)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-[#C9A84C]/30 bg-[#C9A84C]/5 text-xs hover:bg-[#C9A84C]/10 transition-colors rounded-sm"
                >
                  <span className="text-[#C9A84C] font-semibold">{t.label}</span>
                  <span className="text-[#888]">{formatPrice(t.maxBalance)}</span>
                </button>
              ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-[#333]">
          Come back after claiming your daily coins — ₳ converts to ₹ at 1:1
        </p>
      </div>
    </motion.div>
  );
}

function ProcessingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="w-1.5 h-1.5 rounded-full bg-[#080808]"
        />
      ))}
    </span>
  );
}

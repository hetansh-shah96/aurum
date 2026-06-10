"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES, Category, formatPrice } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { MysteryCard } from "@/components/MysteryCard";
import { useWalletStore, selectPlayerRank, RANKS, getRequiredRank } from "@/lib/wallet-store";
import { initFlashes } from "@/lib/flash-store";
import { motion, AnimatePresence } from "framer-motion";

const TICKER_EVENTS = [
  "Priya S. from Mumbai just acquired Patek Philippe 5711",
  "Arjun M. from Delhi added Bugatti Chiron Pur Sport to cart",
  "Rohan K. from Bangalore is viewing Richard Mille RM 11-03",
  "Ananya P. from Hyderabad purchased Hermès Birkin 35",
  "Vikram T. from Pune wishlisted Rolls-Royce Phantom",
  "Deepika R. from Chennai just acquired Audemars Piguet Royal Oak",
  "Rahul N. from Kolkata is browsing the Jewelry collection",
  "Sneha B. from Mumbai added Cartier Love Bracelet to cart",
  "Karan J. from Delhi purchased Sunseeker Manhattan 66",
  "Meera L. from Hyderabad is viewing Lamborghini Huracán EVO",
];

function FomoStrip() {
  const [tickerIdx, setTickerIdx] = useState(0);
  const [viewers] = useState(() => 200 + Math.floor(Math.random() * 80));
  const [liveViewers, setLiveViewers] = useState(viewers);
  const [timeLeft, setTimeLeft] = useState(7 * 60 + 41);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx((i) => (i + 1) % TICKER_EVENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setLiveViewers((v) => v + Math.floor(Math.random() * 5) - 2);
      setTimeLeft((s) => (s > 0 ? s - 1 : 7 * 60 + 41));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="border-b border-[#1a1a1a] hud-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3a3a] animate-pulse flex-shrink-0" />
          <span className="font-mono text-[9px] text-[#555] tracking-widest uppercase">
            LIVE · <span className="text-[#F5F0E8]">{liveViewers}</span>
          </span>
        </div>

        <div className="flex-1 overflow-hidden mx-2 sm:mx-6 hidden sm:block">
          <AnimatePresence mode="wait">
            <motion.p
              key={tickerIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="font-mono text-[9px] text-[#444] text-center truncate tracking-wide"
            >
              <span className="text-[#00d4c8]/60">▶</span> {TICKER_EVENTS[tickerIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="font-mono text-[9px] text-[#444] uppercase tracking-widest hidden sm:inline">Flash ends</span>
          <span className="font-mono text-xs text-amber-400 font-bold tabular-nums">{mins}:{secs}</span>
        </div>
      </div>
    </div>
  );
}

function RankBanner() {
  const playerRank = useWalletStore(selectPlayerRank);
  const lifetimeSpent = useWalletStore((s) => s.lifetimeSpent);
  const nextRank = RANKS.find((r) => r.level === playerRank.level + 1);
  const lockedCount = PRODUCTS.filter((p) => getRequiredRank(p.price).level > playerRank.level).length;

  const progress = nextRank
    ? Math.min(1, (lifetimeSpent - playerRank.threshold) / (nextRank.threshold - playerRank.threshold))
    : 1;

  return (
    <div className="border-b border-[#1a1a2a] bg-[#06060e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 sm:gap-4">
        {/* Rank tag */}
        <div className="flex items-center gap-1.5 flex-shrink-0 border border-[#1a1a2a] px-2 py-1">
          <span className="font-mono text-[8px] text-[#444] tracking-widest">RANK</span>
          <span className="font-semibold text-xs font-mono" style={{ color: playerRank.color }}>
            {playerRank.icon} {playerRank.name.toUpperCase()}
          </span>
        </div>

        {/* XP bar */}
        {nextRank ? (
          <div className="flex-1 flex items-center gap-2.5 min-w-0">
            <span className="font-mono text-[8px] text-[#333] tracking-widest flex-shrink-0 hidden sm:inline">XP</span>
            <div className="flex-1 h-1 bg-[#111] overflow-hidden relative">
              <motion.div
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-y-0 left-0"
                style={{ background: `linear-gradient(90deg, ${playerRank.color}, ${nextRank.color})` }}
              />
            </div>
            <span className="font-mono text-[8px] text-[#444] flex-shrink-0 hidden sm:inline">
              {formatPrice(Math.max(0, nextRank.threshold - lifetimeSpent))} → <span style={{ color: nextRank.color }}>{nextRank.name.toUpperCase()}</span>
            </span>
          </div>
        ) : (
          <span className="font-mono text-[9px] text-[#C9A84C] flex-shrink-0">✦ MAX RANK ACHIEVED</span>
        )}

        {lockedCount > 0 && (
          <div className="flex-shrink-0 flex items-center gap-1 border border-[#ff3a3a]/20 px-2 py-1">
            <span className="font-mono text-[8px] text-[#ff3a3a]/60 tracking-widest">🔒 {lockedCount} LOCKED</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") as Category | null;
  const [active, setActive] = useState<Category | "all">(urlCategory ?? "all");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  useEffect(() => {
    initFlashes(PRODUCTS.map((p) => p.id));
  }, []);

  const filtered = PRODUCTS.filter((p) => active === "all" || p.category === active);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen pt-16">
      <FomoStrip />
      <RankBanner />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-[9px] text-[#00d4c8]/60 tracking-[0.4em] uppercase mb-1">// ITEM DATABASE</p>
          <h1 className="font-display text-5xl md:text-6xl text-[#F5F0E8] mb-1">The Collection</h1>
          <p className="font-mono text-[10px] text-[#444] tracking-widest">{sorted.length} ITEMS AVAILABLE · SESSION ACTIVE</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="border-y border-[#2a2a2a] bg-[#0e0e0e] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-1 no-scrollbar">
            <button
              onClick={() => setActive("all")}
              className={`px-4 py-1.5 text-xs tracking-widest uppercase rounded-sm transition-all ${
                active === "all"
                  ? "bg-[#C9A84C] text-[#080808] font-semibold"
                  : "border border-[#2a2a2a] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C]"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`px-4 py-1.5 text-xs tracking-widest uppercase rounded-sm transition-all whitespace-nowrap ${
                  active === cat.id
                    ? "bg-[#C9A84C] text-[#080808] font-semibold"
                    : "border border-[#2a2a2a] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-[#111] border border-[#2a2a2a] text-[#888] text-xs px-3 py-1.5 rounded-sm outline-none focus:border-[#C9A84C] flex-shrink-0 self-start sm:self-auto"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20">
        {sorted.length === 0 ? (
          <div className="text-center py-20 text-[#555]">No items found.</div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
          >
            {/* Mystery Crate — first slot */}
            {active === "all" && <MysteryCard />}
            {sorted.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-[#555]">Loading collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}

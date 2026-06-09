"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES, Category, formatPrice } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
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
  const [timeLeft, setTimeLeft] = useState(7 * 60 + 41); // 7:41

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
    <div className="border-b border-[#1a1a1a] bg-[#080808]">
      {/* Top bar: live viewers + countdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <span className="text-[10px] text-[#888] tracking-wider">
            <span className="text-[#F5F0E8] font-semibold">{liveViewers}</span> browsing now
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden mx-2 sm:mx-6 hidden sm:block">
          <AnimatePresence mode="wait">
            <motion.p
              key={tickerIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] text-[#555] text-center truncate"
            >
              <span className="text-[#C9A84C]">✦</span> {TICKER_EVENTS[tickerIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[9px] text-[#555] uppercase tracking-widest hidden sm:inline">Flash prices end</span>
          <span className="text-xs font-mono text-amber-400 font-semibold tabular-nums">{mins}:{secs}</span>
        </div>
      </div>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") as Category | null;
  const [active, setActive] = useState<Category | "all">(urlCategory ?? "all");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const filtered = PRODUCTS.filter((p) => active === "all" || p.category === active);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen pt-16">
      <FomoStrip />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-2">The Full Collection</p>
          <h1 className="font-display text-5xl md:text-6xl text-[#F5F0E8] mb-2">Shop</h1>
          <p className="text-[#555] text-sm">{sorted.length} pieces available</p>
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

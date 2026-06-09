"use client";

import { Product, formatPrice } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { useCoinsStore } from "@/lib/coins-store";
import { useWalletStore, selectPlayerRank, getRequiredRank } from "@/lib/wallet-store";
import { getFlashForProduct, FLASH_DISCOUNT } from "@/lib/flash-store";
import { useCoinsToast } from "./CoinsToast";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { StarRating } from "./StarRating";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { earnAddToCart, markProductViewed } = useCoinsStore();
  const { showToast } = useCoinsToast();
  const playerRank = useWalletStore(selectPlayerRank);
  const requiredRank = getRequiredRank(product.price);
  const isLocked = playerRank.level < requiredRank.level;

  const flash = getFlashForProduct(product.id);
  const [flashTimeLeft, setFlashTimeLeft] = useState<number | null>(flash?.active ? flash.endMs - Date.now() : null);
  const flashPrice = flash?.active ? Math.round(product.price * (1 - FLASH_DISCOUNT)) : null;

  useEffect(() => {
    if (!flash?.active) return;
    const interval = setInterval(() => {
      const left = flash.endMs - Date.now();
      setFlashTimeLeft(left > 0 ? left : null);
      if (left <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [flash]);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) return;
    setAdding(true);
    addItem(flashPrice ? { ...product, price: flashPrice } : product);
    const result = earnAddToCart();
    showToast(result.coins, result.label, result.isBonus);
    setTimeout(() => setAdding(false), 1000);
  };

  const handleView = () => {
    const result = markProductViewed(product.id);
    if (result && result.coins > 0) showToast(result.coins, result.label, result.isBonus);
  };

  const fmtCountdown = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const spendToUnlock = requiredRank.threshold - useWalletStore((s) => s.lifetimeSpent);
  const rankProgress = isLocked
    ? Math.min(1, useWalletStore.getState().lifetimeSpent / requiredRank.threshold)
    : 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${product.id}`} className="group block" onClick={handleView}>
        <div
          className={`relative bg-[#111] border rounded-sm overflow-hidden transition-all duration-500 ${
            isLocked
              ? "border-[#222] opacity-80"
              : "border-[#2a2a2a] group-hover:border-[#C9A84C]/50 group-hover:gold-glow"
          }`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Image area */}
          <div className="relative aspect-square overflow-hidden">
            {!loaded && <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />}

            {/* Cinematic reveal wipe */}
            <motion.div
              initial={{ scaleY: 1 }}
              animate={inView ? { scaleY: 0 } : { scaleY: 1 }}
              transition={{ duration: 0.7, delay: (index % 4) * 0.08 + 0.3, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-[#111] z-10 origin-bottom"
            />

            {/* Ken Burns */}
            <motion.div
              animate={{ scale: hovering && !isLocked ? 1.08 : inView ? 1.03 : 1 }}
              transition={{
                scale: hovering && !isLocked
                  ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 8, ease: "linear", repeat: Infinity, repeatType: "reverse" },
              }}
              className="absolute inset-0"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-500 ${isLocked ? "grayscale brightness-50" : ""}`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onLoad={() => setLoaded(true)}
              />
            </motion.div>

            {/* Hover gradient */}
            {!isLocked && (
              <motion.div
                animate={{ opacity: hovering ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-[#080808]/20 to-transparent z-20"
              />
            )}

            {/* Lock overlay */}
            {isLocked && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#080808]/70">
                <div className="text-center px-3">
                  <div
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center mx-auto mb-2"
                    style={{ borderColor: requiredRank.color, color: requiredRank.color }}
                  >
                    <span className="text-lg">{requiredRank.icon}</span>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: requiredRank.color }}>
                    {requiredRank.name}
                  </p>
                  <p className="text-[9px] text-[#888]">Spend {formatPrice(Math.max(0, requiredRank.threshold - useWalletStore.getState().lifetimeSpent))} more to unlock</p>
                  {/* Rank progress bar */}
                  <div className="mt-2 h-1 bg-[#333] rounded-full w-20 mx-auto overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, (useWalletStore.getState().lifetimeSpent / requiredRank.threshold) * 100)}%`,
                        background: `linear-gradient(90deg, ${requiredRank.color}88, ${requiredRank.color})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Badges */}
            {!isLocked && (
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-30">
                {flashPrice && flashTimeLeft && (
                  <span className="px-2 py-0.5 bg-amber-500 text-[#080808] text-[9px] font-bold tracking-widest uppercase rounded-sm">
                    ⚡ -{Math.round(FLASH_DISCOUNT * 100)}% · {fmtCountdown(flashTimeLeft)}
                  </span>
                )}
                {product.exclusive && !flashPrice && (
                  <span className="px-2 py-0.5 bg-[#C9A84C] text-[#080808] text-[9px] font-bold tracking-widest uppercase rounded-sm">
                    Exclusive
                  </span>
                )}
                {product.badge && !product.exclusive && !flashPrice && (
                  <span className="px-2 py-0.5 bg-[#111]/90 border border-[#C9A84C]/50 text-[#C9A84C] text-[9px] tracking-widest uppercase rounded-sm">
                    {product.badge}
                  </span>
                )}
              </div>
            )}

            {product.inStock <= 2 && !isLocked && (
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-gold" />
                <span className="text-[9px] text-amber-400 tracking-wider">Only {product.inStock} left</span>
              </div>
            )}

            {/* Quick add */}
            {!isLocked && (
              <motion.button
                animate={{ opacity: hovering ? 1 : 0, y: hovering ? 0 : 6 }}
                transition={{ duration: 0.2 }}
                onClick={handleAdd}
                className="absolute bottom-2.5 right-2.5 px-3 py-1.5 bg-[#C9A84C] text-[#080808] text-[9px] font-bold tracking-widest uppercase rounded-sm z-30"
              >
                {adding ? "Added ✓" : "Add to Cart"}
              </motion.button>
            )}
          </div>

          {/* Info */}
          <div className="p-3 sm:p-4">
            <p className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-0.5 sm:mb-1 truncate ${isLocked ? "text-[#555]" : "text-[#C9A84C]"}`}>
              {product.brand}
            </p>
            <h3 className={`font-display text-sm sm:text-base leading-tight mb-1.5 line-clamp-2 ${isLocked ? "text-[#444]" : "text-[#F5F0E8] group-hover:text-[#E8D5A3] transition-colors"}`}>
              {product.name}
            </h3>
            <div className="hidden sm:flex items-center gap-2 mb-2">
              <StarRating rating={product.rating} small />
              <span className="text-[10px] text-[#555]">({product.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col">
                {flashPrice && (
                  <span className="text-[9px] text-[#555] line-through leading-none">{formatPrice(product.price)}</span>
                )}
                <span className={`font-display text-sm sm:text-lg font-semibold leading-tight ${
                  isLocked ? "text-[#444]" : flashPrice ? "text-amber-400" : "text-gold-gradient"
                }`}>
                  {formatPrice(flashPrice ?? product.price)}
                </span>
              </div>
              {isLocked ? (
                <span
                  className="px-2 py-1 text-[9px] tracking-widest uppercase border rounded-sm flex-shrink-0"
                  style={{ borderColor: `${requiredRank.color}44`, color: requiredRank.color }}
                >
                  {requiredRank.icon} {requiredRank.name}
                </span>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAdd}
                  className={`btn-shine px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase border rounded-sm transition-all duration-200 flex-shrink-0 ${
                    adding
                      ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "border-[#2a2a2a] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  }`}
                >
                  {adding ? "✓" : "+ Cart"}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

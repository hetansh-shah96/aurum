"use client";

import { Product, formatPrice } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { useCoinsStore } from "@/lib/coins-store";
import { useCoinsToast } from "./CoinsToast";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { StarRating } from "./StarRating";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { earnAddToCart, markProductViewed } = useCoinsStore();
  const { showToast } = useCoinsToast();

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem(product);
    const coins = earnAddToCart();
    showToast(coins, "added to cart");
    setTimeout(() => setAdding(false), 1000);
  };

  const handleView = () => {
    const coins = markProductViewed(product.id);
    if (coins > 0) showToast(coins, "product viewed");
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${product.id}`} className="group block" onClick={handleView}>
        <div
          className="relative bg-[#111] border border-[#2a2a2a] rounded-sm overflow-hidden transition-all duration-500 group-hover:border-[#C9A84C]/50 group-hover:gold-glow"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Image with Ken Burns + cinematic reveal */}
          <div className="relative aspect-square overflow-hidden">
            {/* Loading skeleton shimmer */}
            {!loaded && (
              <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />
            )}

            {/* Cinematic reveal overlay — wipes up on enter */}
            <motion.div
              initial={{ scaleY: 1, originY: "bottom" }}
              animate={inView ? { scaleY: 0 } : { scaleY: 1 }}
              transition={{ duration: 0.7, delay: (index % 4) * 0.08 + 0.3, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-[#111] z-10 origin-bottom"
            />

            <motion.div
              animate={{
                scale: hovering ? 1.08 : inView ? 1.03 : 1,
              }}
              transition={{
                scale: hovering
                  ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 8, ease: "linear", repeat: Infinity, repeatType: "reverse" },
              }}
              className="absolute inset-0"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onLoad={() => setLoaded(true)}
              />
            </motion.div>

            {/* Dark gradient on hover */}
            <motion.div
              animate={{ opacity: hovering ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-[#080808]/20 to-transparent z-20"
            />

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-30">
              {product.exclusive && (
                <span className="px-2 py-0.5 bg-[#C9A84C] text-[#080808] text-[9px] font-bold tracking-widest uppercase rounded-sm">
                  Exclusive
                </span>
              )}
              {product.badge && !product.exclusive && (
                <span className="px-2 py-0.5 bg-[#111]/90 border border-[#C9A84C]/50 text-[#C9A84C] text-[9px] tracking-widest uppercase rounded-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Stock */}
            {product.inStock <= 2 && (
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-gold" />
                <span className="text-[9px] text-amber-400 tracking-wider">Only {product.inStock} left</span>
              </div>
            )}

            {/* Quick add — slides up on hover */}
            <motion.button
              animate={{ opacity: hovering ? 1 : 0, y: hovering ? 0 : 6 }}
              transition={{ duration: 0.2 }}
              onClick={handleAdd}
              className="absolute bottom-2.5 right-2.5 px-3 py-1.5 bg-[#C9A84C] text-[#080808] text-[9px] font-bold tracking-widest uppercase rounded-sm z-30"
            >
              {adding ? "Added ✓" : "Add to Cart"}
            </motion.button>
          </div>

          {/* Info */}
          <div className="p-3 sm:p-4">
            <p className="text-[9px] sm:text-[10px] text-[#C9A84C] tracking-[0.2em] uppercase mb-0.5 sm:mb-1 truncate">
              {product.brand}
            </p>
            <h3 className="font-display text-sm sm:text-base text-[#F5F0E8] leading-tight mb-1.5 group-hover:text-[#E8D5A3] transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="hidden sm:flex items-center gap-2 mb-2">
              <StarRating rating={product.rating} small />
              <span className="text-[10px] text-[#555]">({product.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="font-display text-sm sm:text-lg text-gold-gradient font-semibold leading-tight">
                {formatPrice(product.price)}
              </span>
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
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

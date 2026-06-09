"use client";

import { Product, formatPrice } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { StarRating } from "./StarRating";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const [hovering, setHovering] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem(product);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div
          className="relative bg-[#111] border border-[#2a2a2a] rounded-sm overflow-hidden transition-all duration-300 group-hover:border-[#C9A84C]/40 group-hover:gold-glow"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-700 ${
                hovering ? "scale-110" : "scale-100"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Overlay on hover */}
            <motion.div
              animate={{ opacity: hovering ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.exclusive && (
                <span className="px-2 py-0.5 bg-[#C9A84C] text-[#080808] text-[10px] font-bold tracking-widest uppercase rounded-sm">
                  Exclusive
                </span>
              )}
              {product.badge && !product.exclusive && (
                <span className="px-2 py-0.5 bg-[#111]/90 border border-[#C9A84C]/50 text-[#C9A84C] text-[10px] tracking-widest uppercase rounded-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            {product.inStock <= 2 && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-gold" />
                <span className="text-[10px] text-amber-400 tracking-wider">
                  Only {product.inStock} left
                </span>
              </div>
            )}

            {/* Quick add on hover */}
            <motion.button
              animate={{ opacity: hovering ? 1 : 0, y: hovering ? 0 : 8 }}
              transition={{ duration: 0.2 }}
              onClick={handleAdd}
              className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#C9A84C] text-[#080808] text-[10px] font-bold tracking-widest uppercase rounded-sm"
            >
              {adding ? "Added ✓" : "Add to Cart"}
            </motion.button>
          </div>

          {/* Info */}
          <div className="p-3 sm:p-4">
            <p className="text-[9px] sm:text-[10px] text-[#C9A84C] tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-0.5 sm:mb-1 truncate">
              {product.brand}
            </p>
            <h3 className="font-display text-sm sm:text-base text-[#F5F0E8] leading-tight mb-1.5 sm:mb-2 group-hover:text-[#E8D5A3] transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="hidden sm:flex items-center gap-2 mb-3">
              <StarRating rating={product.rating} small />
              <span className="text-[10px] text-[#555]">({product.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="font-display text-sm sm:text-lg text-gold-gradient font-semibold leading-tight">
                {formatPrice(product.price)}
              </span>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleAdd}
                className={`btn-shine px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase border rounded-sm transition-all duration-200 flex-shrink-0 ${
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

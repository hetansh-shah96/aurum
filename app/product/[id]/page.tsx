"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getProduct, PRODUCTS, formatPrice } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { StarRating } from "@/components/StarRating";
import { LiveViewers } from "@/components/LiveViewers";
import { ProductCard } from "@/components/ProductCard";

const FAKE_REVIEWS = [
  { name: "A. Rothschild", date: "2 days ago", text: "Absolutely breathtaking. The craftsmanship is unrivaled. I have now added 3 of these to my virtual collection.", rating: 5 },
  { name: "V. Montague", date: "1 week ago", text: "Every time I open this page I feel the dopamine hit. 10/10 experience.", rating: 5 },
  { name: "C. Winthrop", date: "2 weeks ago", text: "My cart is now worth $4.2M. I've never felt richer.", rating: 5 },
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProduct(id);
  if (!product) notFound();

  const addItem = useCartStore((s) => s.addItem);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [showAddedBanner, setShowAddedBanner] = useState(false);
  const [cartValue] = useState(() => Math.floor(Math.random() * 12) * 1000 + 4800);

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const handleAdd = () => {
    setAdding(true);
    addItem(product);
    setShowAddedBanner(true);
    setTimeout(() => setAdding(false), 1200);
    setTimeout(() => setShowAddedBanner(false), 3000);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Added to cart banner */}
      <AnimatePresence>
        {showAddedBanner && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-50 bg-[#C9A84C] text-[#080808] py-3 text-center text-sm font-semibold tracking-widest uppercase"
          >
            ✓ Added to your curation — Your cart is now worth {formatPrice(cartValue + product.price)}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#555] mb-8 tracking-widest uppercase">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-[#C9A84C] transition-colors">Shop</Link>
          <span>›</span>
          <span className="text-[#888]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-sm overflow-hidden border border-[#2a2a2a]"
            >
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.exclusive && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#C9A84C] text-[#080808] text-xs font-bold tracking-widest uppercase">
                  Exclusive
                </div>
              )}
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-sm overflow-hidden border transition-all ${
                      activeImage === i ? "border-[#C9A84C]" : "border-[#2a2a2a] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase mb-2">{product.brand}</p>
            <h1 className="font-display text-4xl md:text-5xl text-[#F5F0E8] mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} />
              <span className="text-sm text-[#555]">{product.rating}/5</span>
              <span className="text-sm text-[#555]">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <LiveViewers productId={product.id} />
              {product.inStock <= 3 && (
                <div className="flex items-center gap-1.5 bg-[#111] border border-amber-500/30 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-gold" />
                  <span className="text-[10px] text-amber-400">Only {product.inStock} available</span>
                </div>
              )}
            </div>

            <div className="font-display text-5xl text-gold-gradient font-semibold mb-6">
              {formatPrice(product.price)}
            </div>

            <p className="text-[#888] leading-relaxed mb-8 text-sm">{product.description}</p>

            {/* Details list */}
            <div className="border border-[#2a2a2a] rounded-sm p-5 mb-8 space-y-2.5">
              <p className="text-xs text-[#C9A84C] tracking-widest uppercase mb-3">Specifications</p>
              {product.details.map((detail, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#C9A84C] text-xs mt-0.5">◆</span>
                  <span className="text-sm text-[#888]">{detail}</span>
                </div>
              ))}
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: "✈", label: "White-Glove Delivery" },
                { icon: "🔒", label: "Insured Shipping" },
                { icon: "♾", label: "Lifetime Guarantee" },
              ].map((p) => (
                <div key={p.label} className="flex flex-col items-center gap-1 p-3 border border-[#2a2a2a] rounded-sm text-center">
                  <span className="text-lg">{p.icon}</span>
                  <span className="text-[9px] text-[#555] tracking-wider uppercase leading-tight">{p.label}</span>
                </div>
              ))}
            </div>

            {/* Add to cart */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              className={`btn-shine w-full py-5 text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
                adding
                  ? "bg-[#1a2a1a] border border-green-500 text-green-400"
                  : "bg-[#C9A84C] text-[#080808] hover:bg-[#E8D5A3]"
              }`}
            >
              {adding ? "✓ Added to Curation" : `Acquire for ${formatPrice(product.price)}`}
            </motion.button>

            <p className="text-center text-xs text-[#444] mt-3 tracking-wide">
              No real payment · No actual delivery · Just the feeling
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t border-[#2a2a2a] pt-16 mb-20">
          <h2 className="font-display text-3xl text-[#F5F0E8] mb-8">Client Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FAKE_REVIEWS.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 border border-[#2a2a2a] rounded-sm bg-[#0e0e0e]"
              >
                <StarRating rating={review.rating} small />
                <p className="text-sm text-[#888] mt-3 leading-relaxed italic">"{review.text}"</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-[#C9A84C] tracking-wider">{review.name}</span>
                  <span className="text-xs text-[#444]">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="border-t border-[#2a2a2a] pt-16">
            <h2 className="font-display text-3xl text-[#F5F0E8] mb-8">You May Also Desire</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PRODUCTS, CATEGORIES, formatPrice } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { LiveViewers } from "@/components/LiveViewers";

const FEATURED = PRODUCTS.filter((p) => p.exclusive || p.badge).slice(0, 3);
const TRENDING = PRODUCTS.slice(0, 6);

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492326195702-d990c05bc75b?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-[#080808]/40 to-[#080808]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-[#C9A84C] text-xs tracking-[0.35em] uppercase mb-6 font-light"
          >
            The World's Finest Acquisitions
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="font-display text-5xl sm:text-6xl md:text-8xl font-semibold leading-none mb-6"
          >
            <span className="text-[#F5F0E8]">Indulge</span>
            <br />
            <span className="text-gold-gradient">Without Limits</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-[#888] text-base md:text-xl max-w-xl mx-auto mb-3 leading-relaxed px-2"
          >
            Browse the world's most exclusive luxury goods. Add to cart. Feel the rush.
            Nothing gets delivered — the dopamine is free.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-[#555] text-sm mb-10 tracking-wide"
          >
            ✦ No real charges ✦ No actual delivery ✦ Pure luxury simulation
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/shop"
              className="btn-shine px-8 sm:px-10 py-3.5 sm:py-4 bg-[#C9A84C] text-[#080808] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#E8D5A3] transition-colors duration-200"
            >
              Enter the Collection
            </Link>
            <button
              onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 sm:px-10 py-3.5 sm:py-4 border border-[#2a2a2a] text-[#888] text-sm tracking-[0.2em] uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors duration-200"
            >
              Explore Categories
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-[#555] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#C9A84C] to-transparent" />
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#2a2a2a] bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: "$2.1B+", label: "Total value curated" },
            { value: "47,000+", label: "Items indulged" },
            { value: "189", label: "Countries browsing" },
            { value: "100%", label: "Satisfaction rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl text-gold-gradient font-semibold">{stat.value}</p>
              <p className="text-[10px] text-[#555] tracking-widest uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">Browse by Category</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F5F0E8]">The Collection</h2>
        </motion.div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/shop?category=${cat.id}`}
                className="group flex flex-col items-center gap-3 p-6 border border-[#2a2a2a] rounded-sm hover:border-[#C9A84C]/50 hover:bg-[#111] transition-all duration-200 text-center"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs text-[#888] tracking-widest uppercase group-hover:text-[#C9A84C] transition-colors">
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured / Exclusive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-2">Curated Selection</p>
            <h2 className="font-display text-4xl text-[#F5F0E8]">Exclusive Pieces</h2>
          </div>
          <Link href="/shop" className="text-xs text-[#555] tracking-widest uppercase hover:text-[#C9A84C] transition-colors hidden md:block">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {FEATURED.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="absolute top-20 right-4">
                <LiveViewers productId={product.id} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="bg-[#0a0a0a] border-t border-[#2a2a2a] py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">Most Desired</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F5F0E8]">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {TRENDING.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="btn-shine inline-block px-12 py-4 border border-[#C9A84C] text-[#C9A84C] text-sm tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#080808] transition-colors duration-200"
            >
              View Full Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">A Guilt-Free Indulgence</p>
          <h2 className="font-display text-4xl md:text-5xl text-[#F5F0E8] mb-4">
            You deserve the best.
          </h2>
          <p className="text-[#555] text-lg mb-8 max-w-md mx-auto">
            Fill your cart with the finest things in the world. Checkout. Celebrate. Nothing shipped. Just the feeling.
          </p>
          <Link
            href="/shop"
            className="btn-shine inline-block px-12 py-4 bg-[#C9A84C] text-[#080808] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#E8D5A3] transition-colors duration-200"
          >
            Start Shopping
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl tracking-[0.3em] text-gold-gradient">AURUM</span>
          <p className="text-[10px] text-[#444] tracking-widest uppercase text-center">
            A dopamine simulation experience · No real purchases · Just the joy of luxury
          </p>
          <p className="text-[10px] text-[#333]">© 2026 AURUM</p>
        </div>
      </footer>
    </div>
  );
}

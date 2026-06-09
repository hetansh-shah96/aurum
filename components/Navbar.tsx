"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { WalletBadge } from "./WalletBadge";

export function Navbar() {
  const { totalCount, openCart } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (totalCount > prevCount) {
      setBump(true);
      setTimeout(() => setBump(false), 400);
    }
    setPrevCount(totalCount);
  }, [totalCount, prevCount]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#080808]/95 backdrop-blur-md border-b border-[#2a2a2a]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl tracking-[0.3em] text-gold-gradient font-semibold flex-shrink-0">
          AURUM
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Shop", href: "/shop" },
            { label: "Timepieces", href: "/shop?category=timepieces" },
            { label: "Automobiles", href: "/shop?category=automobiles" },
            { label: "Jewelry", href: "/shop?category=jewelry" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase text-[#888] hover:text-[#C9A84C] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Wallet */}
          <WalletBadge />

          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] rounded-full hover:border-[#C9A84C] transition-colors duration-200 group"
          >
            <svg
              className="w-4 h-4 text-[#C9A84C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="text-xs tracking-widest uppercase text-[#888] group-hover:text-[#C9A84C] transition-colors hidden sm:block">
              Cart
            </span>
            <AnimatePresence>
              {totalCount > 0 && (
                <motion.span
                  key={totalCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: bump ? 1.4 : 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C9A84C] text-[#080808] text-xs font-bold flex items-center justify-center"
                >
                  {totalCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </nav>
  );
}

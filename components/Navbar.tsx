"use client";

import Link from "next/link";
import { useCartStore, selectTotalCount } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { WalletBadge } from "./WalletBadge";

const NAV_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Timepieces", href: "/shop?category=timepieces" },
  { label: "Shoes", href: "/shop?category=shoes" },
  { label: "Leather Goods", href: "/shop?category=leather-goods" },
  { label: "Automobiles", href: "/shop?category=automobiles" },
  { label: "Jewelry", href: "/shop?category=jewelry" },
  { label: "Yachts & Jets", href: "/shop?category=yachts" },
];

export function Navbar() {
  const { openCart } = useCartStore();
  const totalCount = useCartStore(selectTotalCount);
  const [scrolled, setScrolled] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [bump, setBump] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-[#080808]/98 backdrop-blur-md border-b border-[#2a2a2a]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="font-display text-xl sm:text-2xl tracking-[0.3em] text-gold-gradient font-semibold flex-shrink-0"
          >
            AURUM
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.slice(0, 4).map((link) => (
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wallet — hidden on very small screens, shown sm+ */}
            <div className="hidden sm:block">
              <WalletBadge />
            </div>

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-[#2a2a2a] rounded-full hover:border-[#C9A84C] transition-colors duration-200 group"
            >
              <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
                className="block w-5 h-px bg-[#C9A84C] origin-center"
              />
              <motion.span
                animate={{ opacity: menuOpen ? 0 : 1 }}
                className="block w-5 h-px bg-[#C9A84C]"
              />
              <motion.span
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
                className="block w-5 h-px bg-[#C9A84C] origin-center"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#080808]/98 backdrop-blur-md border-b border-[#2a2a2a] md:hidden"
          >
            {/* Wallet row on mobile */}
            <div className="px-5 pt-4 pb-2 border-b border-[#2a2a2a]">
              <WalletBadge />
            </div>
            <nav className="px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm tracking-widest uppercase text-[#888] hover:text-[#C9A84C] transition-colors border-b border-[#1a1a1a] last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

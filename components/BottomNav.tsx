"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore, selectTotalCount } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();
  const { openCart } = useCartStore();
  const totalCount = useCartStore(selectTotalCount);

  const links = [
    {
      href: "/",
      label: "Home",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: "/shop",
      label: "Shop",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-md border-t border-[#2a2a2a] safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {links.map((link) => {
          const active = pathname === link.href || (link.href === "/shop" && pathname.startsWith("/shop"));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-5 py-1.5 rounded-lg transition-colors ${
                active ? "text-[#C9A84C]" : "text-[#555]"
              }`}
            >
              {link.icon}
              <span className="text-[9px] tracking-widest uppercase">{link.label}</span>
              {active && (
                <motion.div
                  layoutId="bottom-indicator"
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-[#C9A84C]"
                />
              )}
            </Link>
          );
        })}

        {/* Cart button */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-1 px-5 py-1.5 text-[#555] active:text-[#C9A84C] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-[9px] tracking-widest uppercase">Cart</span>
          <AnimatePresence>
            {totalCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-0.5 right-3 w-4 h-4 rounded-full bg-[#C9A84C] text-[#080808] text-[9px] font-bold flex items-center justify-center"
              >
                {totalCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalCount } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-[#0e0e0e] border-l border-[#2a2a2a] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2a]">
              <div>
                <h2 className="font-display text-xl text-[#F5F0E8]">Your Curation</h2>
                <p className="text-xs text-[#888] tracking-widest uppercase mt-0.5">
                  {totalCount} {totalCount === 1 ? "piece" : "pieces"}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#2a2a2a] hover:border-[#C9A84C] transition-colors"
              >
                <svg className="w-4 h-4 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="text-5xl opacity-20">◇</div>
                  <p className="text-[#888] text-sm">Your curation is empty.</p>
                  <button
                    onClick={closeCart}
                    className="text-[#C9A84C] text-sm underline underline-offset-4"
                  >
                    Continue browsing
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-3 rounded-lg border border-[#2a2a2a] bg-[#111] hover:border-[#3a3a2a] transition-colors"
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#C9A84C] tracking-widest uppercase mb-0.5">
                          {item.product.brand}
                        </p>
                        <p className="text-sm text-[#F5F0E8] font-medium leading-tight truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-[#C9A84C] mt-1 font-medium">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors text-xs"
                          >
                            −
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors text-xs"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-auto text-xs text-[#555] hover:text-red-400 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[#2a2a2a] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888] tracking-wide">Total Valuation</span>
                  <span className="font-display text-xl text-gold-gradient font-semibold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-[#555] text-center">
                  Complimentary white-glove delivery worldwide
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-shine block w-full py-4 bg-[#C9A84C] text-[#080808] text-center text-sm font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-[#E8D5A3] transition-colors duration-200"
                >
                  Proceed to Acquisition
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

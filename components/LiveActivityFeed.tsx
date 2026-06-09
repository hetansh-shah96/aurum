"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAMES = [
  "Priya S.", "Arjun M.", "Rohan K.", "Ananya P.", "Vikram T.",
  "Deepika R.", "Rahul N.", "Sneha B.", "Karan J.", "Meera L.",
  "Aditya V.", "Pooja G.", "Siddharth C.", "Ishaan W.", "Kavya A.",
];

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];

const ACTIONS = [
  { verb: "just purchased", icon: "🛍️", hot: true },
  { verb: "added to cart", icon: "✦", hot: false },
  { verb: "is viewing", icon: "👁", hot: false },
  { verb: "wishlisted", icon: "♡", hot: false },
  { verb: "just acquired", icon: "🏆", hot: true },
];

const PRODUCTS = [
  { name: "Patek Philippe Nautilus", price: "₹2.8Cr" },
  { name: "Bugatti Chiron", price: "₹18.5Cr" },
  { name: "Richard Mille RM 11-03", price: "₹5.9Cr" },
  { name: "Hermès Birkin 35", price: "₹18.5L" },
  { name: "Rolls-Royce Phantom", price: "₹10.5Cr" },
  { name: "Audemars Piguet Royal Oak", price: "₹45.2L" },
  { name: "Louis Vuitton Keepall", price: "₹1.8L" },
  { name: "Lamborghini Huracán EVO", price: "₹3.7Cr" },
  { name: "Cartier Love Bracelet", price: "₹4.8L" },
  { name: "Van Cleef Alhambra Necklace", price: "₹12.3L" },
  { name: "Tom Ford Vanity Oxford", price: "₹2.6L" },
  { name: "Dior J'Adior Slingback", price: "₹1.2L" },
  { name: "Omega Seamaster", price: "₹8.5L" },
  { name: "Sunseeker Manhattan 66", price: "₹56.2Cr" },
];

let counter = 0;

function randomEntry() {
  counter++;
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  return { id: counter, name, city, action, product };
}

type Entry = ReturnType<typeof randomEntry>;

export function LiveActivityFeed() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const push = () => {
    const entry = randomEntry();
    setEntries((e) => [...e.slice(-2), entry]);
    const ttl = setTimeout(() => setEntries((e) => e.filter((x) => x.id !== entry.id)), 4500);
    return ttl;
  };

  useEffect(() => {
    const first = setTimeout(() => {
      push();
      timerRef.current = setInterval(push, 22000 + Math.random() * 14000);
    }, 6000);
    return () => {
      clearTimeout(first);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-40 flex flex-col gap-2 pointer-events-none max-w-[260px] sm:max-w-[300px]">
      <AnimatePresence>
        {entries.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -32, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -32, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            className="bg-[#0e0e0e]/95 backdrop-blur-sm border border-[#2a2a2a] rounded-sm px-3 py-2.5 shadow-xl"
          >
            <div className="flex items-start gap-2">
              <span className="text-base leading-none mt-0.5 flex-shrink-0">{e.action.icon}</span>
              <div className="min-w-0">
                <p className="text-xs text-[#F5F0E8] leading-tight">
                  <span className={e.action.hot ? "text-[#C9A84C] font-semibold" : "text-[#888]"}>{e.name}</span>
                  {" "}
                  <span className="text-[#555]">from {e.city}</span>
                </p>
                <p className="text-[11px] text-[#888] mt-0.5 leading-tight">
                  {e.action.verb}{" "}
                  <span className="text-[#C9A84C] font-medium">{e.product.name}</span>
                </p>
                <p className="text-[10px] text-[#444] mt-0.5">{e.product.price}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

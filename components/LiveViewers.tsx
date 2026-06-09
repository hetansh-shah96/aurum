"use client";

import { useEffect, useState } from "react";

export function LiveViewers({ productId }: { productId: string }) {
  const [count, setCount] = useState(() => {
    // Deterministic seed from productId so it doesn't jump on hydration
    const seed = productId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return 3 + (seed % 14);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(2, Math.min(24, c + delta));
      });
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 bg-[#111]/90 border border-[#2a2a2a] rounded-full px-2.5 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-gold" />
      <span className="text-[10px] text-[#888]">{count} viewing</span>
    </div>
  );
}

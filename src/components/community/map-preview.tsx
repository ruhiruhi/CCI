"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Node = { id: string; city: string; x: number; y: number; size: number };

// Abstract, stylised presence map (percentage-based positions).
const NODES: Node[] = [
  { id: "1", city: "Leh", x: 30, y: 8, size: 6 },
  { id: "2", city: "Lucknow", x: 52, y: 30, size: 8 },
  { id: "3", city: "Ranchi", x: 66, y: 42, size: 7 },
  { id: "4", city: "Shillong", x: 84, y: 36, size: 8 },
  { id: "5", city: "Pune", x: 33, y: 58, size: 11 },
  { id: "6", city: "Nashik", x: 35, y: 52, size: 7 },
  { id: "7", city: "Hyderabad", x: 45, y: 62, size: 8 },
  { id: "8", city: "Bengaluru", x: 41, y: 74, size: 10 },
  { id: "9", city: "Madurai", x: 46, y: 86, size: 7 },
  { id: "10", city: "Hassan", x: 38, y: 76, size: 6 },
  { id: "11", city: "Beed", x: 39, y: 56, size: 6 },
];

export function MapPreview() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-warm/10 bg-charcoal/40 sm:aspect-[16/10]">
      {/* dotted grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in oklab, var(--color-warm) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_60%_at_40%_55%,color-mix(in_oklab,var(--color-gold)_8%,transparent),transparent)]"
      />

      {NODES.map((n, i) => {
        const active = hover === n.id;
        return (
          <button
            key={n.id}
            onMouseEnter={() => setHover(n.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(n.id)}
            onBlur={() => setHover(null)}
            data-cursor="hover"
            aria-label={n.city}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span className="relative grid place-items-center">
              <motion.span
                className="absolute rounded-full bg-gold/30"
                style={{ width: n.size * 3, height: n.size * 3 }}
                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut",
                }}
              />
              <span
                className="rounded-full bg-gold transition-all duration-300"
                style={{
                  width: active ? n.size + 4 : n.size,
                  height: active ? n.size + 4 : n.size,
                  boxShadow: "0 0 12px 2px color-mix(in oklab, var(--color-gold) 60%, transparent)",
                }}
              />
            </span>
            {active && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/90 px-3 py-1 text-xs text-warm backdrop-blur-sm"
              >
                {n.city}
              </motion.span>
            )}
          </button>
        );
      })}

      <div className="absolute bottom-5 left-5 rounded-full bg-ink/70 px-4 py-2 text-xs text-cloud backdrop-blur-sm">
        67 cities & villages · and counting
      </div>
    </div>
  );
}

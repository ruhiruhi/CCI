"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";

/** Floating circular reading-progress indicator with scroll-to-top. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const dash = useTransform(progress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.06, 1], [0, 1, 1]);

  return (
    <motion.button
      style={{ opacity }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Reading progress — scroll to top"
      data-cursor="hover"
      className="group fixed bottom-6 right-6 z-[110] grid h-14 w-14 place-items-center rounded-full bg-ink/70 backdrop-blur-md"
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="color-mix(in oklab, var(--color-warm) 12%, transparent)"
          strokeWidth="2"
        />
        <motion.circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="100"
          style={{ strokeDashoffset: useTransform(dash, (d) => 100 - d) }}
        />
      </svg>
      <ArrowUp className="h-4 w-4 text-gold transition-transform duration-300 group-hover:-translate-y-0.5" />
    </motion.button>
  );
}

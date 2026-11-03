"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = ["Every screening begins", "a conversation."];

/** Cinematic intro curtain shown once per session. */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard for session-based intro
    setMounted(true);
    if (typeof window !== "undefined" && sessionStorage.getItem("cci-intro")) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      setDone(true);
      sessionStorage.setItem("cci-intro", "1");
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  // Avoid SSR/CSR mismatch: render curtain on first client paint only when needed.
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-ink grain"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: 1, ease: [0.83, 0, 0.17, 1] },
          }}
        >
          <div className="overflow-hidden px-6 text-center">
            {WORDS.map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <motion.span
                  className="block font-display text-3xl font-light tracking-tight text-warm sm:text-5xl"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2 + i * 0.18,
                  }}
                >
                  {i === 2 ? (
                    <span className="text-gold-gradient">{w}</span>
                  ) : (
                    w
                  )}
                </motion.span>
              </span>
            ))}
            <motion.div
              className="mx-auto mt-8 h-px bg-gold/50"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

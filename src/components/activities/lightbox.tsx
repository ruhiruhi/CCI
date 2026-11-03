"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { img } from "@/lib/data";
import type { ActivityImage } from "@/lib/activities";

type LightboxProps = {
  images: ActivityImage[];
  active: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

/** Full-screen lightbox with keyboard Esc / ← / → support. */
export function Lightbox({
  images,
  active,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const current = active !== null ? images[active] : null;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev],
  );

  useEffect(() => {
    if (active === null) return;
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [active, handleKey]);

  return (
    <AnimatePresence>
      {active !== null && current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption ?? current.alt}
          className="fixed inset-0 z-[180] flex items-center justify-center bg-ink/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-warm/20 text-warm transition-colors hover:border-gold hover:text-gold"
            data-cursor="hover"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-warm/20 text-warm transition-colors hover:border-gold hover:text-gold sm:left-8"
            data-cursor="hover"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-warm/20 text-warm transition-colors hover:border-gold hover:text-gold sm:right-8"
            data-cursor="hover"
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          <motion.figure
            key={current.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 max-h-[82vh] w-full max-w-5xl"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-charcoal/60">
              <Image
                src={img(current.src, 1800)}
                alt={current.alt}
                fill
                sizes="100vw"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="pointer-events-none select-none object-contain"
                priority
              />
            </div>
            <figcaption className="mt-4 text-center">
              <p className="text-sm text-mist">
                {active + 1} / {images.length}
              </p>
              {(current.caption ?? current.alt) && (
                <p className="mt-1 text-warm">{current.caption ?? current.alt}</p>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

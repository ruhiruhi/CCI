"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Vertical drift in pixels across the scroll range. Subtle by default. */
  amount?: number;
  priority?: boolean;
  sizes?: string;
  rounded?: boolean;
  /** Cinematic grayscale → colour hover reveal. On by default for featured imagery. */
  cinematic?: boolean;
};

/** A masked image that drifts subtly and reveals with a clip on scroll. */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  amount = 60,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  rounded = true,
  cinematic = true,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(12% 6% 12% 6%)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden bg-charcoal",
        rounded && "rounded-2xl",
        cinematic && "cine-frame",
        className,
      )}
    >
      <motion.div style={{ y }} className="absolute inset-0 -top-[8%] h-[116%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imgClassName)}
        />
      </motion.div>
    </motion.div>
  );
}

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { img, TIMELINE, type TimelineItem } from "@/lib/data";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";

export function Timeline({ items = TIMELINE }: { items?: TimelineItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 80%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative mt-12">
      {/* Spine */}
      <div className="absolute left-[19px] top-0 h-full w-px bg-warm/10 md:left-1/2 md:-translate-x-1/2">
        <motion.div
          style={{ scaleY: lineScale }}
          className="h-full w-full origin-top bg-gradient-to-b from-gold via-gold to-transparent"
        />
      </div>

      <div className="space-y-10 md:space-y-12">
        {items.map((item, i) => {
          const left = i % 2 === 0;
          return (
            <div
              key={item.year}
              className="relative grid gap-6 pl-14 md:grid-cols-2 md:items-center md:gap-10 md:pl-0"
            >
              {/* Node */}
              <span className="absolute left-[11px] top-2 z-10 grid h-4 w-4 place-items-center rounded-full bg-gold ring-4 ring-ink md:left-1/2 md:-translate-x-1/2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              </span>

              {/* Text */}
              <div className={left ? "md:order-1 md:pr-8 md:text-right" : "md:order-2 md:pl-8"}>
                <Reveal>
                  <span className="font-display text-5xl font-light text-gold/80 md:text-6xl">
                    {item.year}
                  </span>
                  <h3 className="mt-3 text-2xl font-medium text-warm">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-md text-cloud/80 md:ml-auto">
                    {item.body}
                  </p>
                </Reveal>
              </div>

              {/* Image */}
              <div className={left ? "md:order-2 md:pl-8" : "md:order-1 md:pr-8"}>
                <ParallaxImage
                  src={img(item.image, 1200)}
                  alt={item.title}
                  className="aspect-[4/3] w-full"
                  amount={36}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

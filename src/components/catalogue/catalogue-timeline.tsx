"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { CatalogueTimelinePhase } from "@/lib/catalogue";
import { Reveal } from "@/components/motion/reveal";

export function CatalogueTimeline({ phases }: { phases: CatalogueTimelinePhase[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 80%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative mt-10">
      <div className="absolute left-[19px] top-0 h-full w-px bg-warm/10 md:left-1/2 md:-translate-x-1/2">
        <motion.div
          style={{ scaleY: lineScale }}
          className="h-full w-full origin-top bg-gradient-to-b from-gold via-gold to-transparent"
        />
      </div>

      <div className="space-y-10 md:space-y-12">
        {phases.map((phase, index) => {
          const left = index % 2 === 0;
          return (
            <div
              key={phase.label}
              className="relative grid gap-6 pl-14 md:grid-cols-2 md:items-center md:gap-12 md:pl-0"
            >
              <span className="absolute left-[11px] top-2 z-10 grid h-4 w-4 place-items-center rounded-full bg-gold ring-4 ring-ink md:left-1/2 md:-translate-x-1/2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              </span>

              <div className={left ? "md:order-1 md:pr-10 md:text-right" : "md:order-2 md:pl-10"}>
                <Reveal>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
                    {phase.label}
                  </p>
                  <p className="mt-2 font-display text-3xl font-light text-gold/85 md:text-4xl">
                    {phase.weeks}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium text-warm">{phase.title}</h3>
                  <p className="mt-3 max-w-md text-cloud/80 md:ml-auto">{phase.body}</p>
                </Reveal>
              </div>

              <div
                className={
                  left
                    ? "md:order-2 md:pl-10"
                    : "md:order-1 md:pr-10 md:text-right"
                }
              >
                <Reveal delay={0.08}>
                  <div className="card-modern rounded-[1.5rem] p-6 md:p-8">
                    <p className="text-sm uppercase tracking-[0.18em] text-mist">Programming arc</p>
                    <p className="mt-3 font-display text-4xl font-light text-warm">
                      {phase.weeks.replace("Weeks ", "")}
                    </p>
                    <p className="mt-2 text-sm text-cloud/80">
                      Weekly screenings and guided discussions under the Conscious Cinema Initiative.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

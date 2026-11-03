"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { IMPACT_BREAKDOWN, IMPACT_BY_YEAR, REGIONS } from "@/lib/data";
import { Counter } from "@/components/motion/counter";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Metric = "screenings" | "students";

/* ---------------- Growth area chart ---------------- */
export function GrowthChart() {
  const [metric, setMetric] = useState<Metric>("students");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  const W = 820;
  const H = 320;
  const padX = 16;
  const padY = 28;

  const data = IMPACT_BY_YEAR;
  const max = Math.max(...data.map((d) => d[metric]));
  const stepX = (W - padX * 2) / (data.length - 1);

  const points = data.map((d, i) => {
    const x = padX + i * stepX;
    const y = H - padY - (d[metric] / max) * (H - padY * 2);
    return { x, y, d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${H - padY} L ${points[0].x} ${H - padY} Z`;

  return (
    <div ref={ref} className="rounded-3xl border border-warm/10 bg-charcoal/40 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-mist">Growth over time</p>
          <p className="font-display text-2xl font-light text-warm">
            {metric === "students" ? "Students reached" : "Screenings held"}
          </p>
        </div>
        <div className="flex gap-2">
          {(["students", "screenings"] as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              data-cursor="hover"
              className={cn(
                "rounded-full border px-4 py-2 text-xs capitalize transition-all duration-300",
                metric === m
                  ? "border-gold bg-gold text-ink"
                  : "border-warm/15 text-cloud hover:border-warm/40",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${metric} growth from ${data[0].year} to ${data[data.length - 1].year}`}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={padX}
            x2={W - padX}
            y1={H - padY - g * (H - padY * 2)}
            y2={H - padY - g * (H - padY * 2)}
            stroke="color-mix(in oklab, var(--color-warm) 8%, transparent)"
            strokeWidth={1}
          />
        ))}

        {/* area */}
        <motion.path
          d={areaPath}
          fill="url(#areaFill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        />

        {/* line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.8, ease: EASE }}
        />

        {/* dots */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3.5}
            fill="var(--color-ink)"
            stroke="var(--color-gold)"
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.12 }}
          />
        ))}
      </svg>

      <div className="mt-3 flex justify-between px-1">
        {data.map((d) => (
          <span key={d.year} className="text-[0.65rem] text-ash">
            {d.year}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Breakdown bars ---------------- */
export function BreakdownBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <div
      ref={ref}
      className="rounded-3xl border border-warm/10 bg-charcoal/40 p-6 md:p-8"
    >
      <p className="text-sm text-mist">Screenings by setting</p>
      <p className="font-display text-2xl font-light text-warm">Where we screen</p>

      <div className="mt-8 space-y-6">
        {IMPACT_BREAKDOWN.map((b, i) => {
          const pct = Math.round((b.value / b.total) * 100);
          return (
            <div key={b.label}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm text-cloud">{b.label}</span>
                <span className="font-display text-lg text-gold">
                  <Counter value={b.value} />
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-warm/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${pct}%` } : {}}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.2 + i * 0.15 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Regions ---------------- */
export function RegionBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <div
      ref={ref}
      className="rounded-3xl border border-warm/10 bg-charcoal/40 p-6 md:p-8"
    >
      <p className="text-sm text-mist">Reach by region</p>
      <p className="font-display text-2xl font-light text-warm">Across the country</p>

      <div className="mt-8 space-y-6">
        {REGIONS.map((r, i) => (
          <div key={r.region}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm text-cloud">{r.region}</span>
              <span className="text-sm text-mist">
                <Counter value={r.cities} /> cities
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-warm/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
                initial={{ width: 0 }}
                animate={inView ? { width: `${r.share * 2.2}%` } : {}}
                transition={{ duration: 1.4, ease: EASE, delay: 0.2 + i * 0.12 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

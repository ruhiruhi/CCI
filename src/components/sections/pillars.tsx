import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { img, PILLARS, type Pillar } from "@/lib/data";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { SectionLayout } from "@/components/sections/section-layout";

export function Pillars({ pillars = PILLARS }: { pillars?: Pillar[] }) {
  return (
    <div className="space-y-10 md:space-y-14">
      {pillars.map((p, i) => {
        const flip = i % 2 === 1;
        return (
          <SectionLayout
            key={p.title}
            flip={flip}
            media={
              <ParallaxImage
                src={img(p.image, 1200)}
                alt={p.title}
                className="section-layout-image aspect-[4/5]"
                amount={40}
                sizes="(max-width: 1024px) 90vw, 42vw"
              />
            }
          >
            <Reveal>
              <span className="font-display text-7xl font-light text-warm/10 md:text-8xl">
                {p.index}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="kicker -mt-6 mb-4">{p.tagline}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-4xl font-light tracking-tight text-warm md:text-5xl">
                {p.title}
              </h3>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-cloud/80">
                {p.body}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="mt-7 space-y-3">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-warm/90">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/40">
                      <Check className="h-3.5 w-3.5 text-gold" />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </Reveal>
          </SectionLayout>
        );
      })}

      <Reveal className="flex justify-center">
        <Link
          href="/our-activities"
          className="group inline-flex items-center gap-2 text-sm font-medium text-warm link-underline"
        >
          See the pillars in action
          <ArrowUpRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>
    </div>
  );
}

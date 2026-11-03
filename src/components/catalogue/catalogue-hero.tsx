"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { img } from "@/lib/data";
import type { CatalogueContent } from "@/lib/catalogue";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { LeadCta } from "@/components/leads/lead-cta";

type CatalogueHeroProps = {
  hero: CatalogueContent["hero"];
};

export function CatalogueHero({ hero }: CatalogueHeroProps) {
  return (
    <section className="relative flex min-h-[42svh] items-end overflow-hidden grain bg-black md:min-h-[48svh]">
      <Image
        src={img(hero.image, 2000, 80)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-ambient object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/45 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_10%,transparent_40%,var(--color-ink)_100%)]" />

      <div className="shell relative z-10 pb-10 pt-24 md:pb-12 md:pt-28">
        <Reveal>
          <p className="kicker mb-4">{hero.kicker}</p>
        </Reveal>
        <h1 className="max-w-5xl font-display text-[clamp(2.2rem,6.5vw,5.25rem)] font-light leading-[0.98] tracking-tight text-warm">
          {hero.titleLines.map((line, i) => (
            <TextReveal
              key={line}
              lines={[line]}
              delay={0.1 + i * 0.1}
              lineClassName={
                i === hero.titleLines.length - 1
                  ? "text-gold-gradient italic"
                  : undefined
              }
            />
          ))}
        </h1>
        <Reveal delay={0.35}>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cloud/85 md:mt-5">
            {hero.subtitle}
          </p>
        </Reveal>
        <Reveal delay={0.5}>
          <div className="mt-6 flex flex-wrap gap-4 md:mt-7">
            <Magnetic>
              <Link href="#categories" className="btn-cci-primary group h-14 px-8">
                Browse Categories
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
            <Magnetic>
              <LeadCta
                href="/contact?interest=Screening%20Request"
                label="Request Screening"
                interest="Screening Request"
                forceLead
                className="btn-cci-secondary inline-flex h-14 items-center justify-center px-8"
              />
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

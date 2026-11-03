"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { img, LOCAL_IMAGES } from "@/lib/data";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { LeadCta } from "@/components/leads/lead-cta";

type CtaBandProps = {
  kicker?: string;
  titleLines?: string[];
  body?: string;
  image?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function CtaBand({
  kicker = "Join the movement",
  titleLines = ["Bring a meaningful film", "conversation to your", "community."],
  body = "Host a screening, volunteer your skills, support a student filmmaker, or partner with us to expand access.",
  image = LOCAL_IMAGES.heroScreening,
  primary = { label: "Join the movement", href: "/join" },
  secondary = { label: "Start a conversation", href: "/contact" },
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="shell">
        <div className="card-modern relative overflow-hidden rounded-[2rem] border-warm/15 p-0 shadow-[var(--shadow-medium)]">
          <div className="relative min-h-[20rem] md:min-h-[22rem]">
            <Image
              src={img(image, 1800)}
              alt=""
              fill
              sizes="100vw"
              className="cci-image object-cover opacity-90"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(58,33,20,0.92) 0%, rgba(58,33,20,0.55) 48%, rgba(26,16,8,0.35) 100%), radial-gradient(circle at 24% 20%, rgba(245,185,66,0.22), transparent 42%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />

            <div className="relative z-10 flex min-h-[20rem] flex-col items-center justify-center px-6 py-14 text-center sm:px-12 md:min-h-[22rem] md:py-16">
              {kicker && (
                <Reveal>
                  <p className="kicker mb-4">{kicker}</p>
                </Reveal>
              )}
              <TextReveal
                lines={titleLines}
                className="mx-auto font-display text-4xl font-light leading-[1.05] tracking-tight text-warm sm:text-6xl"
              />
              <Reveal delay={0.2}>
                <p className="mx-auto mt-5 max-w-xl text-lg text-cloud/90">
                  {body}
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Magnetic>
                    <LeadCta
                      href={primary.href}
                      label={primary.label}
                      className="btn-cci-primary group inline-flex h-14 items-center gap-2 px-8"
                    >
                      {primary.label}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </LeadCta>
                  </Magnetic>
                  <Magnetic>
                    <LeadCta
                      href={secondary.href}
                      label={secondary.label}
                      className="btn-cci-secondary inline-flex h-14 items-center justify-center px-8"
                    />
                  </Magnetic>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

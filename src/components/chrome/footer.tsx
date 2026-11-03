"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import {
  CONTACT_EMAILS,
  NAV_LINKS,
  SECONDARY_LINKS,
  SOCIAL_LINKS,
  flattenNavLinks,
} from "@/lib/data";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { LeadCta } from "@/components/leads/lead-cta";

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.94 8.5H3.75V20h3.19V8.5zM5.34 3.5a1.85 1.85 0 100 3.7 1.85 1.85 0 000-3.7zM20.25 20h-3.18v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V20H9.88V8.5h3.05v1.57h.04c.42-.8 1.46-1.65 3-1.65 3.21 0 3.8 2.11 3.8 4.86V20z" />
    </svg>
  );
}

function YouTubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22.5 7.2a3.1 3.1 0 00-2.18-2.2C18.4 4.5 12 4.5 12 4.5s-6.4 0-8.32.5A3.1 3.1 0 001.5 7.2 32.4 32.4 0 001 12a32.4 32.4 0 00.5 4.8 3.1 3.1 0 002.18 2.2c1.92.5 8.32.5 8.32.5s6.4 0 8.32-.5a3.1 3.1 0 002.18-2.2A32.4 32.4 0 0023 12a32.4 32.4 0 00-.5-4.8zM10 15.2V8.8l5.2 3.2L10 15.2z" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  Instagram: InstagramGlyph,
  LinkedIn: LinkedInGlyph,
  YouTube: YouTubeGlyph,
} as const;

export function Footer({
  email = CONTACT_EMAILS.general,
  address = "Distributed initiative across India",
  siteName = "Conscious Cinema Initiative",
}: {
  email?: string;
  address?: string;
  siteName?: string;
}) {
  const explore = [...flattenNavLinks(NAV_LINKS), ...SECONDARY_LINKS];
  const mid = Math.ceil(explore.length / 2);
  const exploreLeft = explore.slice(0, mid);
  const exploreRight = explore.slice(mid);

  return (
    <footer className="relative overflow-hidden border-t border-warm/10 bg-section-warm grain">
      <div className="shell relative z-10 pb-10 pt-14 md:pb-12 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div>
            <p className="kicker mb-5">Become part of the movement</p>
            <TextReveal
              lines={["Cinema can change", "a life. Yours could", "change a community."]}
              className="font-display text-4xl font-light leading-[1.05] tracking-tight text-warm sm:text-6xl"
            />
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-4">
              <Magnetic>
                <LeadCta
                  href="/join"
                  label="Join the Movement"
                  className="btn-cci-primary group inline-flex h-14 items-center gap-2 px-8"
                >
                  Join the Movement
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </LeadCta>
              </Magnetic>
              <Magnetic>
                <LeadCta
                  href="/contact"
                  label="Start a conversation"
                  className="btn-cci-secondary inline-flex h-14 items-center justify-center px-8"
                />
              </Magnetic>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.25em] text-mist">
                Explore
              </p>
              <ul className="space-y-3">
                {exploreLeft.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="link-underline text-sm text-cloud hover:text-warm"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.25em] text-mist">
                Explore
              </p>
              <ul className="space-y-3">
                {exploreRight.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="link-underline text-sm text-cloud hover:text-warm"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="mb-5 text-xs uppercase tracking-[0.25em] text-mist">
                Reach us
              </p>
              <ul className="space-y-4 text-sm text-cloud">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <div className="space-y-1">
                    <a href={`mailto:${email}`} className="link-underline block">
                      General: {email}
                    </a>
                    <a
                      href={`mailto:${CONTACT_EMAILS.media}`}
                      className="link-underline block"
                    >
                      Media: {CONTACT_EMAILS.media}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{address}</span>
                </li>
              </ul>
              <div className="mt-6 flex gap-3">
                {SOCIAL_LINKS.map(({ label, href }) => {
                  const Icon = SOCIAL_ICONS[label as keyof typeof SOCIAL_ICONS];
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-warm/15 text-cloud transition-colors hover:border-gold hover:text-gold"
                      data-cursor="hover"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-warm/10 pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/30">
              <Image
                src="/logo.jpeg"
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="text-sm text-mist">
              © {new Date().getFullYear()} {siteName}
            </span>
          </div>
          <p className="text-xs text-ash">
            Crafted as a movement, not a website. A nationwide movement using cinema for awareness, education, social impact, and filmmaker empowerment.
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[120%] -translate-x-1/2 rounded-[50%] bg-gold/[0.06] blur-3xl"
      />
    </footer>
  );
}

"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, type CSSProperties, type PointerEvent } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LOCAL_IMAGES, DAY1_IMAGES, DAY2_IMAGES, STATS } from "@/lib/data";
import { Magnetic } from "@/components/motion/magnetic";
import { LeadCta } from "@/components/leads/lead-cta";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_STILLS = [
  { src: DAY2_IMAGES.screenOnTripod, alt: "A film projected on a portable screen under the trees" },
  { src: DAY2_IMAGES.projectorCrowd, alt: "A portable projector lighting up faces in the crowd" },
  { src: DAY1_IMAGES.screenFilmScene, alt: "A story shared on screen during a neighborhood screening" },
] as const;

export type HeroContent = {
  kicker: string;
  headline: string[];
  subheading: string;
  backgroundImage?: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

const DEFAULT_HEADLINE = ["Every screening begins", "a conversation."];

export function Hero({
  kicker = "A national movement through cinema",
  headline = DEFAULT_HEADLINE,
  subheading = "CCI brings meaningful cinema into classrooms, campuses, and communities to inspire awareness, learning, and action.",
  backgroundImage,
  ctaPrimary = { label: "Explore our activities", href: "/our-activities" },
  ctaSecondary = { label: "Join the movement", href: "/join" },
}: Partial<HeroContent> = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const videoPoster = backgroundImage ?? LOCAL_IMAGES.heroScreening;
  const heroStats = STATS.slice(0, 4);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--scene-x", `${x}%`);
    event.currentTarget.style.setProperty("--scene-y", `${y}%`);
  }

  function loopFirstTwentySeconds() {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime >= 20) {
      video.currentTime = 0;
      void video.play();
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const play = () => {
      void video.play().catch(() => undefined);
    };
    play();
    video.addEventListener("canplay", play);
    return () => video.removeEventListener("canplay", play);
  }, []);

  return (
    <section
      ref={ref}
      onPointerMove={handlePointerMove}
      style={{ "--scene-x": "50%", "--scene-y": "44%" } as CSSProperties}
      className="group/opening relative isolate min-h-[100svh] w-full overflow-hidden grain bg-black"
    >
      <motion.div style={{ scale: imgScale }} className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onTimeUpdate={loopFirstTwentySeconds}
          poster={videoPoster}
          className="hero-video absolute inset-0 h-full w-full object-cover object-center opacity-[0.9] animate-ambient"
          aria-hidden="true"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Darkens only the video — content sits above at z-10 */}
        <div
          className="hero-overlay pointer-events-none absolute inset-0 z-[1] bg-black/55 max-md:bg-black/65"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] transition-[background] duration-500"
          style={{
            background:
              "radial-gradient(circle at var(--scene-x) var(--scene-y), rgba(246,200,95,0.35), transparent 24rem), linear-gradient(90deg, rgba(58,33,20,0.88), rgba(58,33,20,0.42) 44%, rgba(58,33,20,0.12)), linear-gradient(0deg, rgba(26,16,8,0.95), transparent 34%, rgba(58,33,20,0.55))",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-ink to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="hero-content shell relative z-10 grid min-h-[100svh] content-end gap-6 pb-8 pt-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.45fr)] lg:items-end lg:gap-8 lg:pb-12 lg:pt-24"
      >
        <div className="max-w-5xl pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.5 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            <span className="kicker rounded-full border border-warm/25 bg-warm/10 px-4 py-2 shadow-[var(--shadow-soft)] backdrop-blur-md">
              {kicker}
            </span>
            <span className="hidden h-px w-16 bg-warm/30 md:block" />
            <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft md:inline">
              Opening Scene
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
            className="mb-5 max-w-xl text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft/90 sm:text-sm sm:tracking-[0.22em]"
          >
            A film begins before the first line is spoken.
          </motion.p>

          <h1 className="max-w-5xl font-display text-[clamp(2.4rem,7.5vw,5.5rem)] font-light leading-[0.95] tracking-tight text-warm drop-shadow-[0_12px_42px_rgba(58,33,20,0.5)]">
            {headline.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.5 + i * 0.12 }}
                >
                  {i === headline.length - 1 ? (
                    <span className="text-gold-gradient italic">{line}</span>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.05 }}
            className="mt-7 max-w-2xl text-base leading-relaxed text-cloud/90 sm:text-lg"
          >
            {subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.25 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <LeadCta
                href={ctaPrimary.href}
                label={ctaPrimary.label}
                className="btn-cci-primary group inline-flex h-14 items-center gap-2 px-8 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
              >
                {ctaPrimary.label}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </LeadCta>
            </Magnetic>
            <Magnetic>
              <LeadCta
                href={ctaSecondary.href}
                label={ctaSecondary.label}
                className="btn-cci-secondary inline-flex h-14 items-center justify-center border-warm/55 bg-ink/75 px-8 text-warm shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:bg-ink/85 hover:text-warm"
              />
            </Magnetic>
          </motion.div>
        </div>

        <aside className="relative hidden min-h-[28rem] lg:block" aria-label="Program stills">
          {HERO_STILLS.map((still, index) => (
            <figure
              key={still.src}
              className={cn(
                "absolute overflow-hidden border border-warm/30 bg-warm/10 p-2 shadow-[var(--shadow-medium)] backdrop-blur-md transition duration-700 group-hover/opening:brightness-110",
                index === 0 &&
                  "right-0 top-4 w-64 rotate-3 rounded-[2rem] group-hover/opening:-translate-y-1",
                index === 1 &&
                  "left-0 top-36 w-56 -rotate-6 rounded-[1.5rem] group-hover/opening:-translate-x-1",
                index === 2 &&
                  "bottom-8 right-8 w-60 rotate-[-2deg] rounded-[2.25rem] group-hover/opening:translate-x-1",
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem]">
                <Image
                  src={still.src}
                  alt={still.alt}
                  fill
                  sizes="280px"
                  className="cci-image object-cover"
                />
              </div>
            </figure>
          ))}
        </aside>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.4 }}
          className="grid gap-3 border-t border-warm/20 pt-5 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4"
        >
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.25rem] bg-warm/8 p-4 backdrop-blur-md transition duration-300 hover:bg-warm/12"
            >
              <p className="stat-value font-display text-3xl tracking-tight">
                {stat.prefix}
                {stat.value.toLocaleString()}
                {stat.suffix}
              </p>
              <p className="mt-1 text-sm font-medium text-warm">{stat.label}</p>
              <p className="mt-1 text-xs leading-5 text-mist">{stat.detail}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2 lg:bottom-6"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-mist">Scroll</span>
        <span className="relative grid h-10 w-6 place-items-start justify-center rounded-full border border-warm/25 pt-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1 rounded-full bg-gold [animation:scroll-cue_1.8s_var(--ease-cinema)_infinite]" />
        </span>
        <ArrowDown className="h-3.5 w-3.5 text-mist" />
      </motion.div>
    </section>
  );
}

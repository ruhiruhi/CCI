"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";
import { EVENTS, img, type EventItem } from "@/lib/data";

const AUTOPLAY_DELAY_MS = 3500;
const RESUME_AFTER_MANUAL_MS = 5000;

function EventCard({ event }: { event: EventItem }) {
  return (
    <article
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-warm/12 bg-charcoal/40 shadow-[var(--shadow-soft)] transition duration-500 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[var(--shadow-medium)]"
      data-cursor="hover"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={img(event.image, 900)}
          alt={event.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1199px) 33vw, 25vw"
          loading="lazy"
          className="cci-image object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-gold backdrop-blur-sm">
          {event.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-medium leading-snug text-warm">{event.title}</h3>
        <p className="mt-3 flex-1 text-sm text-cloud/75">{event.blurb}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-mist">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold" />
            {event.date}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" />
            {event.city}
          </span>
        </div>
      </div>
    </article>
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function EventsCarousel({ events = EVENTS }: { events?: EventItem[] }) {
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable plugin instance — never call play/stop until Embla has initialized it
  const autoplayPlugin = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: typeof window === "undefined" ? true : !prefersReducedMotion(),
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: false,
      duration: 32,
    },
    [autoplayPlugin.current],
  );

  const getAutoplay = useCallback(() => {
    const plugin = emblaApi?.plugins()?.autoplay;
    return plugin ?? null;
  }, [emblaApi]);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }, []);

  const scheduleResume = useCallback(() => {
    if (prefersReducedMotion()) return;
    clearResumeTimer();
    const ap = getAutoplay();
    ap?.stop();
    resumeTimer.current = setTimeout(() => {
      getAutoplay()?.play();
    }, RESUME_AFTER_MANUAL_MS);
  }, [clearResumeTimer, getAutoplay]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    scheduleResume();
  }, [emblaApi, scheduleResume]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    scheduleResume();
  }, [emblaApi, scheduleResume]);

  // Reduced motion + cleanup — only after Embla API exists
  useEffect(() => {
    if (!emblaApi) return;

    const applyMotionPreference = () => {
      const ap = emblaApi.plugins()?.autoplay;
      if (!ap) return;
      if (prefersReducedMotion()) ap.stop();
      else ap.play();
    };

    applyMotionPreference();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", applyMotionPreference);

    const onPointerDown = () => {
      if (prefersReducedMotion()) return;
      clearResumeTimer();
      emblaApi.plugins()?.autoplay?.stop();
    };

    const onPointerUp = () => {
      scheduleResume();
    };

    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);

    return () => {
      mq.removeEventListener("change", applyMotionPreference);
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
      clearResumeTimer();
    };
  }, [emblaApi, clearResumeTimer, scheduleResume]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollNext();
    }
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Upcoming screenings and events"
      onKeyDown={onKeyDown}
    >
      <div className="shell flex items-end justify-end gap-3">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous events"
          className="grid h-12 w-12 place-items-center rounded-full border border-warm/20 text-warm transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
          data-cursor="hover"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next events"
          className="grid h-12 w-12 place-items-center rounded-full border border-warm/20 text-warm transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
          data-cursor="hover"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-8 px-[clamp(1.25rem,5vw,5rem)] pb-6">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-6 flex touch-pan-y">
            {events.map((e) => (
              <div
                key={e.title}
                className="min-w-0 shrink-0 grow-0 basis-full pl-6 sm:basis-1/2 lg:basis-1/3 min-[1200px]:basis-1/4"
                role="group"
                aria-roledescription="slide"
                aria-label={e.title}
              >
                <EventCard event={e} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

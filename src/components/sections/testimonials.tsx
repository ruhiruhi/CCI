"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { img, TESTIMONIALS } from "@/lib/data";
import { cn } from "@/lib/utils";

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

type TestimonialsProps = {
  items?: readonly TestimonialItem[];
  /** Auto-advance interval in ms. Set 0 to disable. */
  autoplayMs?: number;
  className?: string;
};

export function Testimonials({
  items = TESTIMONIALS,
  autoplayMs = 5500,
  className,
}: TestimonialsProps) {
  const list = items.length > 0 ? [...items] : [...TESTIMONIALS];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-testimonial-card]");
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
    setIndex((prev) => {
      const next = (prev + dir + list.length) % list.length;
      return next;
    });
  };

  useEffect(() => {
    if (!autoplayMs || paused || list.length < 2) return;
    const id = window.setInterval(() => scrollByCard(1), autoplayMs);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only restart on pause/autoplay
  }, [autoplayMs, paused, list.length]);

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mb-5 flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Previous testimonials"
          data-cursor="hover"
          onClick={() => scrollByCard(-1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-warm/15 text-warm transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next testimonials"
          data-cursor="hover"
          onClick={() => scrollByCard(1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-warm/15 text-warm transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-live="polite"
      >
        {list.map((t, i) => (
          <article
            key={`${t.name}-${i}`}
            data-testimonial-card
            className={cn(
              "card-modern relative w-[min(100%,20rem)] shrink-0 snap-start p-6 sm:w-[22rem] sm:p-7",
              i === index && "ring-1 ring-gold/25",
            )}
          >
            <Quote className="h-7 w-7 text-gold/55" aria-hidden />
            <p className="mt-5 font-display text-lg font-light leading-snug tracking-tight text-warm sm:text-xl">
              “{t.quote}”
            </p>
            <footer className="mt-7 flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-gold/30">
                <Image
                  src={img(t.image, 200)}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span className="text-left">
                <span className="block text-sm font-medium text-warm">{t.name}</span>
                <span className="block text-xs text-mist">{t.role}</span>
              </span>
            </footer>
          </article>
        ))}
      </div>

      {/* TODO: Wire Google Places Reviews API when GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID are set */}
      {process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ? null : null}
    </div>
  );
}

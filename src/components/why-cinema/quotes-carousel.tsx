"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export type CinemaQuote = {
  quote: string;
  author: string;
};

const PER_PAGE = 3;

export function QuotesCarousel({ quotes }: { quotes: CinemaQuote[] }) {
  const pageCount = Math.max(1, Math.ceil(quotes.length / PER_PAGE));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const goPrev = useCallback(() => {
    setPage((current) => (current - 1 + pageCount) % pageCount);
  }, [pageCount]);

  const goNext = useCallback(() => {
    setPage((current) => (current + 1) % pageCount);
  }, [pageCount]);

  const start = page * PER_PAGE;
  const visible = quotes.slice(start, start + PER_PAGE);

  return (
    <div className="relative">
      <div
        key={page}
        className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((q, i) => (
          <Reveal key={`${q.author}-${start + i}`} delay={i * 0.05} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-warm/10 bg-charcoal/30 p-6 md:p-7">
              <blockquote className="flex-1 font-display text-xl font-light leading-snug tracking-tight text-warm sm:text-2xl">
                <span className="text-gold-gradient">“</span>
                {q.quote}
                <span className="text-gold-gradient">”</span>
              </blockquote>
              <figcaption className="mt-6 text-sm text-mist">— {q.author}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous quotes"
            onClick={goPrev}
            data-cursor="hover"
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full border border-warm/15 text-warm",
              "transition hover:border-gold/40 hover:text-gold",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-xs uppercase tracking-[0.16em] text-mist">
            {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            aria-label="Next quotes"
            onClick={goNext}
            data-cursor="hover"
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full border border-warm/15 text-warm",
              "transition hover:border-gold/40 hover:text-gold",
            )}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

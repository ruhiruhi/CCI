"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { GALLERY, img, type GalleryItem } from "@/lib/data";
import {
  formatGalleryEventDate,
  sortGalleryByEventDate,
} from "@/lib/gallery-sort";
import { cn } from "@/lib/utils";

const FILTERS = [
  "All",
  "Screenings",
  "Workshops",
  "Communities",
  "Behind the Scenes",
] as const;

type Filter = (typeof FILTERS)[number];

const BATCH = 9;

/** Expand the base set into a larger archive for an infinite-scroll feel. */
function buildPool(items: GalleryItem[]): GalleryItem[] {
  return Array.from({ length: 5 }).flatMap((_, pass) =>
    items.map((g) => (pass === 0 ? g : { ...g, id: `${g.id}-${pass}` })),
  );
}

export function GalleryClient({ items: galleryItems = GALLERY }: { items?: GalleryItem[] }) {
  // Sort newest → oldest before paging / filters / lightbox (undated last)
  const sortedItems = useMemo(
    () => sortGalleryByEventDate(galleryItems),
    [galleryItems],
  );
  const archive = useMemo(() => buildPool(sortedItems), [sortedItems]);
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<number | null>(null);
  const [count, setCount] = useState(BATCH);
  const sentinel = useRef<HTMLDivElement>(null);

  const filtered = useMemo<GalleryItem[]>(
    () =>
      filter === "All" ? archive : archive.filter((g) => g.category === filter),
    [archive, filter],
  );

  const visibleItems = useMemo(() => filtered.slice(0, count), [filtered, count]);

  // Reset the visible window whenever the filter changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset paging on filter change
    setCount(BATCH);
  }, [filter]);

  // Infinite scroll: reveal the next batch as the sentinel enters view.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(c + BATCH, filtered.length));
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered.length]);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((a) => (a === null ? a : (a + 1) % visibleItems.length)),
    [visibleItems.length],
  );
  const prev = useCallback(
    () => setActive((a) => (a === null ? a : (a - 1 + visibleItems.length) % visibleItems.length)),
    [visibleItems.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, next, prev]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            data-cursor="hover"
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm transition-all duration-400",
              filter === f
                ? "border-gold bg-gold text-ink"
                : "border-warm/15 text-cloud hover:border-warm/40 hover:text-warm",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Masonry */}
      <motion.div
        layout
        className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4"
      >
        <AnimatePresence mode="popLayout">
          {visibleItems.map((g, i) => (
            <motion.button
              key={g.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActive(i)}
              data-cursor="hover"
              className={cn(
                "cine-frame group relative block w-full overflow-hidden rounded-xl",
                g.span === "tall" && "aspect-[3/4]",
                g.span === "wide" && "aspect-[3/2]",
                g.span === "regular" && "aspect-square",
              )}
            >
              <Image
                src={img(g.src, 900)}
                alt={g.caption}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-gold">
                    {g.category}
                  </span>
                  {formatGalleryEventDate(g.eventDate) && (
                    <time
                      dateTime={g.eventDate}
                      className="text-xs uppercase tracking-[0.18em] text-mist"
                    >
                      {formatGalleryEventDate(g.eventDate)}
                    </time>
                  )}
                </div>
                <p className="mt-1 text-sm text-warm">{g.caption}</p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite-scroll sentinel + status */}
      <div ref={sentinel} className="h-px w-full" aria-hidden />
      <div className="mt-12 flex flex-col items-center gap-3 text-sm text-mist">
        {count < filtered.length ? (
          <span className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            Loading more of the archive…
          </span>
        ) : (
          <span>You&apos;ve reached the end of the archive — for now.</span>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && visibleItems[active] && (
          <motion.div
            className="fixed inset-0 z-[180] flex items-center justify-center bg-ink/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-warm/20 text-warm transition-colors hover:border-gold hover:text-gold"
              data-cursor="hover"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-warm/20 text-warm transition-colors hover:border-gold hover:text-gold sm:left-8"
              data-cursor="hover"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-warm/20 text-warm transition-colors hover:border-gold hover:text-gold sm:right-8"
              data-cursor="hover"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <motion.figure
              key={visibleItems[active].id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-4 max-h-[82vh] w-full max-w-5xl"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl">
                <Image
                  src={img(visibleItems[active].src, 1800)}
                  alt={visibleItems[active].caption}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-4 text-center">
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-gold">
                    {visibleItems[active].category}
                  </span>
                  {formatGalleryEventDate(visibleItems[active].eventDate) && (
                    <time
                      dateTime={visibleItems[active].eventDate}
                      className="text-xs uppercase tracking-[0.18em] text-mist"
                    >
                      {formatGalleryEventDate(visibleItems[active].eventDate)}
                    </time>
                  )}
                </div>
                <p className="mt-1 text-warm">{visibleItems[active].caption}</p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

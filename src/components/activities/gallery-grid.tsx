"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { img } from "@/lib/data";
import type { ActivityImage } from "@/lib/activities";
import { cn } from "@/lib/utils";

type GalleryGridProps = {
  images: ActivityImage[];
  onSelect: (index: number) => void;
};

/** Responsive masonry grid with lazy images and loading skeletons. */
export function GalleryGrid({ images, onSelect }: GalleryGridProps) {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  return (
    <motion.div
      layout
      className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4"
    >
      <AnimatePresence mode="popLayout">
        {images.map((image, i) => {
          const span = image.span ?? "regular";
          const isLoaded = loaded[image.id];

          return (
            <motion.button
              key={image.id}
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelect(i)}
              data-cursor="hover"
              aria-label={`Open image: ${image.alt}`}
              className={cn(
                "cine-frame group relative block w-full overflow-hidden rounded-xl",
                span === "tall" && "aspect-[3/4]",
                span === "wide" && "aspect-[3/2]",
                span === "regular" && "aspect-square",
              )}
            >
              {/* Skeleton placeholder — reserved aspect prevents CLS */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 animate-pulse bg-charcoal/70 transition-opacity duration-500",
                  isLoaded ? "opacity-0" : "opacity-100",
                )}
              />
              <Image
                src={img(image.src, 900)}
                alt={image.alt}
                fill
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={cn(
                  "select-none object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0",
                )}
                onLoad={() =>
                  setLoaded((prev) => ({ ...prev, [image.id]: true }))
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm text-warm">
                  {image.caption ?? image.alt}
                </p>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

"use client";

import { useCallback, useState } from "react";
import type { ActivityImage } from "@/lib/activities";
import { GalleryGrid } from "@/components/activities/gallery-grid";
import { Lightbox } from "@/components/activities/lightbox";

type ActivityGalleryProps = {
  images: ActivityImage[];
};

/** Location gallery: masonry grid + keyboard-navigable lightbox. */
export function ActivityGallery({ images }: ActivityGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () =>
      setActive((a) => (a === null || images.length === 0 ? a : (a + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () =>
      setActive((a) =>
        a === null || images.length === 0
          ? a
          : (a - 1 + images.length) % images.length,
      ),
    [images.length],
  );

  if (images.length === 0) {
    return (
      <p className="text-center text-cloud/70">
        No activity images for this location yet.
      </p>
    );
  }

  return (
    <>
      <GalleryGrid images={images} onSelect={setActive} />
      <Lightbox
        images={images}
        active={active}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </>
  );
}

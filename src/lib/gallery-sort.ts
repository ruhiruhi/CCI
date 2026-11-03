/* ------------------------------------------------------------------ */
/*  Gallery chronological sort — reusable, CMS-safe                     */
/*  Flip GALLERY_SORT_DIRECTION to "oldest" for reverse order.          */
/* ------------------------------------------------------------------ */

export type GallerySortDirection = "newest" | "oldest";

/** Default: latest event first. Switch to "oldest" if needed. */
export const GALLERY_SORT_DIRECTION: GallerySortDirection = "newest";

type Dated = {
  eventDate?: string | null;
};

function eventTime(iso?: string | null): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
}

/**
 * Sort gallery items by ISO event date (YYYY-MM-DD).
 * - newest: DESC (default)
 * - oldest: ASC
 * Items without a valid date are always placed at the end.
 * Stable for equal dates (preserves relative input order).
 */
export function sortGalleryByEventDate<T extends Dated>(
  items: T[],
  direction: GallerySortDirection = GALLERY_SORT_DIRECTION,
): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aTime = eventTime(a.item.eventDate);
      const bTime = eventTime(b.item.eventDate);

      if (aTime === null && bTime === null) return a.index - b.index;
      if (aTime === null) return 1;
      if (bTime === null) return -1;

      const diff = direction === "newest" ? bTime - aTime : aTime - bTime;
      return diff !== 0 ? diff : a.index - b.index;
    })
    .map(({ item }) => item);
}

/** Display helper — formats ISO YYYY-MM-DD for UI (e.g. 9 Nov 2025). */
export function formatGalleryEventDate(
  iso?: string | null,
): string | null {
  const t = eventTime(iso);
  if (t === null) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(t));
}

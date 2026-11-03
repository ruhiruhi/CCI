/** Shared helpers for admin content CRUD */

import type { ContentStatus } from "@prisma/client";

export const CONTENT_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "SCHEDULED",
  "ARCHIVED",
  "TRASH",
] as const;

export type ContentStatusValue = (typeof CONTENT_STATUSES)[number];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function dbUnavailableResponse() {
  return {
    error:
      "Database unavailable. Start MySQL locally and run npm run db:setup, or use the VPS admin panel.",
  };
}

export function normalizeGalleryBody(body: unknown) {
  const b = body as Record<string, unknown>;
  const src = String(b.src ?? "").trim();
  const caption = String(b.caption ?? "").trim();
  const category = String(b.category ?? "").trim();
  if (!src) return { error: "Image URL (src) is required." };
  if (!caption) return { error: "Caption is required." };
  if (!category) return { error: "Category is required." };

  let eventDate: Date | null = null;
  if (b.eventDate) {
    const d = new Date(String(b.eventDate));
    if (!Number.isNaN(d.getTime())) eventDate = d;
  }

  return {
    src,
    alt: String(b.alt ?? caption).trim() || null,
    category,
    caption,
    span: String(b.span ?? "regular").trim() || "regular",
    eventDate,
    featured: Boolean(b.featured),
    sortOrder: Number(b.sortOrder) || 0,
    status: (String(b.status ?? "PUBLISHED") as ContentStatus) || "PUBLISHED",
  };
}

export function normalizeEventBody(body: unknown, existingSlug?: string) {
  const b = body as Record<string, unknown>;
  const title = String(b.title ?? "").trim();
  const city = String(b.city ?? "").trim();
  const type = String(b.type ?? "").trim();
  const blurb = String(b.blurb ?? "").trim();
  const dateRaw = String(b.date ?? "").trim();

  if (!title) return { error: "Title is required." };
  if (!city) return { error: "City is required." };
  if (!type) return { error: "Type is required." };
  if (!blurb) return { error: "Blurb is required." };
  if (!dateRaw) return { error: "Date is required." };

  const date = new Date(dateRaw);
  if (Number.isNaN(date.getTime())) return { error: "Invalid date." };

  let endDate: Date | null = null;
  if (b.endDate) {
    const d = new Date(String(b.endDate));
    if (!Number.isNaN(d.getTime())) endDate = d;
  }

  const slug =
    String(b.slug ?? "").trim() ||
    existingSlug ||
    slugify(title) ||
    `event-${Date.now()}`;

  return {
    title,
    slug,
    date,
    endDate,
    city,
    type,
    image: String(b.image ?? "").trim() || null,
    blurb,
    description: String(b.description ?? "").trim() || null,
    isPast: Boolean(b.isPast),
    registration: Boolean(b.registration),
    status: (String(b.status ?? "PUBLISHED") as ContentStatus) || "PUBLISHED",
  };
}

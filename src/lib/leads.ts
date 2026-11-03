/* ------------------------------------------------------------------ */
/*  Lead Management — shared constants & helpers                       */
/* ------------------------------------------------------------------ */

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "CONVERTED",
  "CLOSED",
] as const;

export type LeadStatusValue = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatusValue, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_PROGRESS: "In Progress",
  CONVERTED: "Converted",
  CLOSED: "Closed",
};

export const LEAD_INTERESTS = [
  "Join the Movement",
  "Volunteer",
  "Support",
  "Contact",
  "Donation",
  "Partnership",
  "Screening Request",
  "Community",
  "Other",
] as const;

export type LeadInterest = (typeof LEAD_INTERESTS)[number];

/** Map a CTA label / href intent to a canonical interest. */
export function interestFromCta(
  label: string,
  href?: string,
): LeadInterest {
  const text = `${label} ${href ?? ""}`.toLowerCase();

  if (text.includes("donat") || text.includes("fund")) return "Donation";
  if (text.includes("partner") || text.includes("csr")) return "Partnership";
  if (text.includes("screen") || text.includes("intent=screening"))
    return "Screening Request";
  if (text.includes("volunteer")) return "Volunteer";
  if (text.includes("community") || text.includes("involved")) return "Community";
  if (text.includes("support") || text.includes("give")) return "Support";
  if (text.includes("contact") || text.includes("conversation") || text.includes("message"))
    return "Contact";
  if (text.includes("join") || text.includes("movement") || text.includes("register"))
    return "Join the Movement";

  return "Other";
}

/** Hrefs that should route to Contact with interest pre-selected. */
export function isLeadCtaHref(href: string): boolean {
  try {
    const path = href.startsWith("http")
      ? new URL(href).pathname
      : href.split("?")[0];
    // Join CTAs go to /join — do not redirect those to Contact.
    if (path === "/join") return false;
    return (
      path === "/support" ||
      path === "/contact" ||
      path === "/newsletter"
    );
  } catch {
    return false;
  }
}

/** Build /contact URL with interest query for CTA handoff. */
export function contactPathForInterest(interest: string): string {
  return `/contact?interest=${encodeURIComponent(interest)}`;
}

/** Build /join URL for membership / Join the Movement CTAs. */
export function joinPathForInterest(interest: string): string {
  return `/join?interest=${encodeURIComponent(interest)}`;
}

/** Resolve ?interest= from Contact URL into a canonical lead interest. */
export function parseInterestParam(
  raw: string | string[] | undefined | null,
): LeadInterest {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return "Contact";

  let decoded = value;
  try {
    decoded = decodeURIComponent(value).trim();
  } catch {
    decoded = value.trim();
  }

  const exact = LEAD_INTERESTS.find(
    (i) => i.toLowerCase() === decoded.toLowerCase(),
  );
  if (exact) return exact;

  return interestFromCta(decoded);
}

export function sanitizeText(value: string, max = 500): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max);
}

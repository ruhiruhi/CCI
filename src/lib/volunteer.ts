import type { VolunteerStatus } from "@prisma/client";

export const VOLUNTEER_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const satisfies readonly VolunteerStatus[];

export type VolunteerStatusFilter = (typeof VOLUNTEER_STATUSES)[number];

export const VOLUNTEER_STATUS_LABELS: Record<VolunteerStatusFilter, string> = {
  PENDING: "Pending Verification",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://consciouscine.org";

/** Normalize Indian mobile to digits-only local 10-digit form when possible. */
export function normalizeIndianMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function isValidIndianMobile(raw: string): boolean {
  const local = normalizeIndianMobile(raw);
  return /^[6-9]\d{9}$/.test(local);
}

export function formatVolunteerId(year: number, seq: number): string {
  return `CCI-${year}-${String(seq).padStart(4, "0")}`;
}

/* Support Needed — constants & helpers */

export const SUPPORT_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type SupportPriorityValue = (typeof SUPPORT_PRIORITIES)[number];

export const SUPPORT_PRIORITY_LABELS: Record<SupportPriorityValue, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const SUPPORT_ITEM_STATUSES = ["OPEN", "CLOSED"] as const;
export type SupportItemStatusValue = (typeof SUPPORT_ITEM_STATUSES)[number];

export const SUPPORT_ITEM_STATUS_LABELS: Record<
  SupportItemStatusValue,
  string
> = {
  OPEN: "Open",
  CLOSED: "Closed",
};

export const SUPPORT_REQUEST_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
] as const;
export type SupportRequestStatusValue =
  (typeof SUPPORT_REQUEST_STATUSES)[number];

export const SUPPORT_REQUEST_STATUS_LABELS: Record<
  SupportRequestStatusValue,
  string
> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
};

export const SUPPORT_CATEGORIES = [
  "Production",
  "Screening",
  "Others",
] as const;

export function remainingQuantity(needed: number, received: number): number {
  return Math.max(0, needed - received);
}

export function progressPercent(needed: number, received: number): number {
  if (needed <= 0) return 0;
  return Math.min(100, Math.round((received / needed) * 100));
}

export function sanitizeSupportText(value: string, max = 2000): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max);
}

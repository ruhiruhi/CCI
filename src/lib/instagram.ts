export const INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/consciouscinemaa";

export const INSTAGRAM_HANDLE = "@consciouscinemaa";

/**
 * Curated Instagram reel URLs only (prefer /reel/ paths).
 * Add up to 6 links — each renders as an official Instagram embed.
 * Do NOT embed the full profile page.
 *
 * TODO: Populate from admin / Instagram Graph API when
 * INSTAGRAM_ACCESS_TOKEN is configured.
 */
export const INSTAGRAM_POST_URLS: string[] = [
  // Example format (replace with live reel URLs from admin):
  // "https://www.instagram.com/reel/XXXXXXXXXXX/",
];

export function isReelUrl(url: string): boolean {
  return /instagram\.com\/(reel|reels)\//i.test(url);
}

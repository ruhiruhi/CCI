import type { MetadataRoute } from "next";
import { ACTIVITY_LOCATIONS } from "@/lib/activities";

const BASE = "https://consciouscine.org";

const ROUTES = [
  "",
  "/about",
  "/why-cinema",
  "/impact",
  "/film-literacy-hub",
  "/gallery",
  "/catalogue",
  "/our-activities",
  "/activities",
  "/community",
  "/support",
  "/donate",
  "/join",
  "/transparency",
  "/contact",
  "/newsletter",
  ...ACTIVITY_LOCATIONS.map((l) => `/our-activities/${l.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

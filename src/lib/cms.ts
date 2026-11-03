import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  STATS,
  PILLARS,
  TIMELINE,
  STORIES,
  GALLERY,
  EVENTS,
  PARTNERS,
  PROJECTS,
  LOCAL_IMAGES,
  DAY1_IMAGES,
  DAY2_IMAGES,
  IMAGES,
} from "@/lib/data";
import { CATALOGUE_CONTENT, type CatalogueContent } from "@/lib/catalogue";
import {
  ACTIVITY_LOCATIONS,
  type ActivityLocation,
} from "@/lib/activities";
import { sortGalleryByEventDate } from "@/lib/gallery-sort";

export async function getPublishedStats() {
  try {
    const rows = await prisma.stat.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((s) => ({
        value: s.value,
        suffix: s.suffix ?? undefined,
        prefix: s.prefix ?? undefined,
        label: s.label,
        detail: s.detail,
      }));
    }
  } catch {
    /* DB unavailable — fall back */
  }
  return STATS;
}

export async function getPublishedHero() {
  try {
    const hero = await prisma.heroSection.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
    });
    if (hero) return hero;
  } catch {
    /* fallback */
  }
  return {
    kicker: "A national movement through cinema",
    headline: ["Every screening begins", "a conversation."],
    subheading:
      "CCI brings meaningful cinema into classrooms, campuses, and communities to inspire awareness, learning, and action.",
    backgroundImage: LOCAL_IMAGES.heroScreening,
    ctaPrimary: { label: "Explore our activities", href: "/our-activities" },
    ctaSecondary: { label: "Join the movement", href: "/join" },
  };
}

export async function getPublishedPillars() {
  try {
    const rows = await prisma.pillar.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((p) => ({
        index: p.index,
        title: p.title,
        tagline: p.tagline,
        body: p.body,
        points: p.points as string[],
        image: p.image,
      }));
    }
  } catch {
    /* fallback */
  }
  return PILLARS;
}

export async function getPublishedTimeline() {
  try {
    const rows = await prisma.timelineItem.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((t) => ({
        year: t.year,
        title: t.title,
        body: t.body,
        image: t.image,
      }));
    }
  } catch {
    /* fallback */
  }
  return TIMELINE;
}

export async function getPublishedStories() {
  try {
    const rows = await prisma.communityStory.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((s) => ({
        name: s.name,
        role: s.role,
        location: s.location,
        quote: s.quote,
        image: s.image ?? IMAGES.portraitGirl,
      }));
    }
  } catch {
    /* fallback */
  }
  return STORIES;
}

export async function getPublishedGallery() {
  try {
    const rows = await prisma.galleryItem.findMany({
      where: { status: "PUBLISHED" },
      // Prefer event date (newest first); undated items sorted in JS to the end
      orderBy: [{ eventDate: "desc" }, { sortOrder: "asc" }],
    });
    if (rows.length > 0) {
      const mapped = rows.map((g) => ({
        id: g.id,
        src: g.src,
        category: g.category as
          | "Screenings"
          | "Workshops"
          | "Communities"
          | "Behind the Scenes",
        caption: g.caption,
        span: g.span as "tall" | "wide" | "regular",
        eventDate: g.eventDate
          ? g.eventDate.toISOString().slice(0, 10)
          : undefined,
      }));
      return sortGalleryByEventDate(mapped);
    }
  } catch {
    /* fallback */
  }
  return sortGalleryByEventDate(GALLERY);
}

export async function getPublishedEvents() {
  try {
    const rows = await prisma.event.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { date: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((e) => ({
        title: e.title,
        date: e.date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        city: e.city,
        type: e.type,
        image: e.image ?? IMAGES.projector,
        blurb: e.blurb,
      }));
    }
  } catch {
    /* fallback */
  }
  return EVENTS;
}

export async function getPublishedPartners() {
  try {
    const rows = await prisma.partner.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return rows.map((p) => p.name);
  } catch {
    /* fallback */
  }
  return [...PARTNERS];
}

export async function getPublishedProjects() {
  try {
    const rows = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    });
    if (rows.length > 0) {
      return rows.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        location: p.location,
        summary: p.summary,
        image: p.image ?? IMAGES.filmmaker,
      }));
    }
  } catch {
    /* fallback */
  }
  return PROJECTS;
}

export async function getPublishedCatalogue(): Promise<CatalogueContent> {
  try {
    const page = await prisma.pageContent.findFirst({
      where: { page: "catalogue", status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
    });
    if (page?.sections) {
      return page.sections as CatalogueContent;
    }
  } catch {
    /* fallback */
  }
  return CATALOGUE_CONTENT;
}

/** CMS-ready: publish locations under PageContent page = "our-activities". */
export async function getPublishedActivityLocations(): Promise<
  ActivityLocation[]
> {
  try {
    const page = await prisma.pageContent.findFirst({
      where: { page: "our-activities", status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
    });
    if (page?.sections) {
      const sections = page.sections as { locations?: ActivityLocation[] };
      if (Array.isArray(sections.locations) && sections.locations.length > 0) {
        return sections.locations;
      }
    }
  } catch {
    /* fallback */
  }
  return ACTIVITY_LOCATIONS;
}

export async function getPublishedActivityLocation(
  slug: string,
): Promise<ActivityLocation | undefined> {
  const locations = await getPublishedActivityLocations();
  return locations.find((l) => l.slug === slug);
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    if (row) return row.value as T;
  } catch {
    /* fallback */
  }
  return fallback;
}

export type SiteSettings = {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  maintenanceMode?: boolean;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: "Conscious Cinema Initiative",
  tagline: "A nationwide movement using cinema for awareness, education, social impact, and filmmaker empowerment.",
  email: "hello@consciouscine.org",
  phone: "programs@consciouscine.org",
  address: "Distributed initiative across India",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  return getSiteSetting("site", DEFAULT_SITE_SETTINGS);
}

export async function logActivity(
  userId: string | null | undefined,
  action: string,
  entity: string,
  entityId?: string,
  details?: Prisma.InputJsonValue,
) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId ?? undefined,
        action,
        entity,
        entityId,
        details: details ?? undefined,
      },
    });
  } catch {
    /* non-critical */
  }
}

export async function getDashboardStats() {
  const [
    contacts,
    volunteers,
    subscribers,
    projects,
    events,
    gallery,
    partners,
    pendingVolunteers,
    pendingMemberships,
    unreadContacts,
  ] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.volunteerApplication.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.event.count({ where: { status: "PUBLISHED" } }),
    prisma.galleryItem.count({ where: { status: "PUBLISHED" } }),
    prisma.partner.count({ where: { status: "PUBLISHED" } }),
    prisma.volunteerApplication.count({ where: { status: "PENDING" } }),
    prisma.membershipApplication.count({ where: { status: "PENDING" } }),
    prisma.contactSubmission.count({ where: { read: false } }),
  ]);

  let supportOpen = 0;
  let supportPending = 0;
  try {
    [supportOpen, supportPending] = await Promise.all([
      prisma.supportItem.count({ where: { status: "OPEN" } }),
      prisma.supportRequest.count({ where: { status: "PENDING" } }),
    ]);
  } catch {
    supportOpen = 0;
    supportPending = 0;
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let visitors = 0;
  try {
    visitors = await prisma.pageView.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
  } catch {
    visitors = 0;
  }

  return {
    visitors,
    projects,
    events,
    galleryImages: gallery,
    volunteers,
    partners,
    subscribers,
    contacts,
    pendingApprovals: pendingVolunteers + pendingMemberships,
    unreadContacts,
    supportOpen,
    supportPending,
  };
}

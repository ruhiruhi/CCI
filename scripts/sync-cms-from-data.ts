/**
 * Force-sync published CMS records from src/lib/data.ts.
 * Use after deploy when the VPS database has stale seeded content.
 * Run: npx tsx scripts/sync-cms-from-data.ts
 */
import { PrismaClient } from "@prisma/client";
import {
  STATS,
  PILLARS,
  TIMELINE,
  STORIES,
  GALLERY,
  EVENTS,
  PARTNERS,
  PROJECTS,
  DAY1_IMAGES,
  DAY2_IMAGES,
  LOCAL_IMAGES,
} from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  const hero = await prisma.heroSection.findFirst({ orderBy: { updatedAt: "desc" } });
  const heroData = {
    kicker: "A national movement through cinema",
    headline: ["Every screening begins", "a conversation."],
    subheading:
      "CCI brings meaningful cinema into classrooms, campuses, and communities to inspire awareness, learning, and action.",
    backgroundImage: LOCAL_IMAGES.heroScreening,
    ctaPrimary: { label: "Explore our work", href: "/our-work" },
    ctaSecondary: { label: "Join the movement", href: "/support" },
    status: "PUBLISHED" as const,
  };

  if (hero) {
    await prisma.heroSection.update({ where: { id: hero.id }, data: heroData });
  } else {
    await prisma.heroSection.create({ data: heroData });
  }

  await prisma.stat.deleteMany();
  await prisma.stat.createMany({
    data: STATS.map((s, i) => ({
      value: s.value,
      suffix: s.suffix ?? null,
      prefix: s.prefix ?? null,
      label: s.label,
      detail: s.detail,
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });

  await prisma.pillar.deleteMany();
  await prisma.pillar.createMany({
    data: PILLARS.map((p, i) => ({
      index: p.index,
      title: p.title,
      tagline: p.tagline,
      body: p.body,
      points: p.points,
      image: p.image,
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });

  await prisma.timelineItem.deleteMany();
  await prisma.timelineItem.createMany({
    data: TIMELINE.map((t, i) => ({
      year: t.year,
      title: t.title,
      body: t.body,
      image: t.image,
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });

  await prisma.communityStory.deleteMany();
  await prisma.communityStory.createMany({
    data: STORIES.map((s, i) => ({
      name: s.name,
      role: s.role,
      location: s.location,
      quote: s.quote,
      image: s.image,
      tags: [],
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });

  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: GALLERY.map((g, i) => ({
      src: g.src,
      category: g.category,
      caption: g.caption,
      span: g.span,
      eventDate: g.eventDate ? new Date(`${g.eventDate}T00:00:00.000Z`) : null,
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });

  await prisma.event.deleteMany();
  for (const e of EVENTS) {
    await prisma.event.create({
      data: {
        title: e.title,
        slug: e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        date: new Date(e.date),
        city: e.city,
        type: e.type,
        image: e.image,
        blurb: e.blurb,
        status: "PUBLISHED",
      },
    });
  }

  await prisma.partner.deleteMany();
  await prisma.partner.createMany({
    data: PARTNERS.map((name, i) => ({
      name,
      type: "NGO" as const,
      sortOrder: i,
      status: "PUBLISHED" as const,
      projects: [],
    })),
  });

  await prisma.project.deleteMany();
  for (const p of PROJECTS) {
    await prisma.project.create({
      data: {
        title: p.title,
        slug: p.slug,
        category: p.episode ?? "Documentary",
        location: p.location,
        summary: p.summary,
        body: p.story.join("\n\n"),
        image: p.cover,
        status: "PUBLISHED",
      },
    });
  }

  const mediaAssets = [
    ...Object.entries(DAY1_IMAGES).map(([key, url]) => ({
      filename: `${key}.webp`,
      url,
      type: "IMAGE" as const,
      folder: "day1",
      alt: key.replace(/([A-Z])/g, " $1").trim(),
    })),
    ...Object.entries(DAY2_IMAGES).map(([key, url]) => ({
      filename: `${key}.webp`,
      url,
      type: "IMAGE" as const,
      folder: "day2",
      alt: key.replace(/([A-Z])/g, " $1").trim(),
    })),
  ];

  await prisma.mediaAsset.deleteMany({ where: { folder: { in: ["day1", "day2"] } } });
  await prisma.mediaAsset.createMany({ data: mediaAssets });

  console.log("CMS synced from data.ts");
  console.log(`  gallery: ${GALLERY.length} items`);
  console.log(`  events: ${EVENTS.length} items`);
  console.log(`  hero background: ${LOCAL_IMAGES.heroScreening}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

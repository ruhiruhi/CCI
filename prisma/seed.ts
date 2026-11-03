import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
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
} from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@consciouscinema.in";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "SUPER_ADMIN", active: true },
    create: {
      email: adminEmail,
      name: "CCI Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      active: true,
    },
  });

  const heroCount = await prisma.heroSection.count();
  if (heroCount === 0) {
    await prisma.heroSection.create({
      data: {
        kicker: "A national movement through cinema",
        headline: ["Every screening begins", "a conversation."],
        subheading:
          "CCI brings meaningful cinema into classrooms, campuses, and communities to inspire awareness, learning, and action.",
        backgroundImage: DAY2_IMAGES.screenOnTripod,
        ctaPrimary: { label: "Explore our work", href: "/our-work" },
        ctaSecondary: { label: "Join the movement", href: "/support" },
        status: "PUBLISHED",
      },
    });
  }

  if ((await prisma.stat.count()) === 0) {
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
  }

  if ((await prisma.pillar.count()) === 0) {
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
  }

  if ((await prisma.timelineItem.count()) === 0) {
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
  }

  if ((await prisma.communityStory.count()) === 0) {
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
  }

  if ((await prisma.galleryItem.count()) === 0) {
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
  }

  if ((await prisma.event.count()) === 0) {
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
  }

  if ((await prisma.partner.count()) === 0) {
    await prisma.partner.createMany({
      data: PARTNERS.map((name, i) => ({
        name,
        type: "NGO" as const,
        sortOrder: i,
        status: "PUBLISHED" as const,
        projects: [],
      })),
    });
  }

  if ((await prisma.project.count()) === 0) {
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
  }

  if ((await prisma.mediaAsset.count()) === 0) {
    await prisma.mediaAsset.createMany({
      data: [
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
      ],
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "site" },
    update: {},
    create: {
      key: "site",
      value: {
        name: "Conscious Cinema Initiative",
        tagline: "A nationwide movement using cinema for awareness, education, social impact, and filmmaker empowerment.",
        email: "hello@consciouscinema.org",
        phone: "programs@consciouscinema.org",
        address: "Distributed initiative across India",
        social: {
          instagram: "https://instagram.com/consciouscinema",
          youtube: "https://youtube.com/@consciouscinema",
          linkedin: "https://linkedin.com/company/conscious-cinema",
        },
      },
    },
  });

  if ((await prisma.supportItem.count()) === 0) {
    await prisma.supportItem.createMany({
      data: [
        {
          title: "Need School Bags",
          category: "Production",
          description:
            "Durable school bags for children attending film-literacy workshops and community learning sessions.",
          quantityNeeded: 100,
          quantityReceived: 0,
          unit: "bags",
          image: DAY2_IMAGES.screeningDayWide,
          priority: "HIGH",
          status: "OPEN",
        },
        {
          title: "Need Blankets",
          category: "Screening",
          description:
            "Warm blankets for outdoor evening screenings and overnight volunteer stays in colder months.",
          quantityNeeded: 50,
          quantityReceived: 0,
          unit: "blankets",
          image: DAY2_IMAGES.screeningNightWide,
          priority: "MEDIUM",
          status: "OPEN",
        },
        {
          title: "Need Books",
          category: "Others",
          description:
            "Storybooks and film-literacy reading materials for classrooms and community libraries.",
          quantityNeeded: 200,
          quantityReceived: 0,
          unit: "books",
          image: DAY1_IMAGES.audienceAttentive,
          priority: "URGENT",
          status: "OPEN",
        },
      ],
    });
  }

  console.log(`Seed complete. Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

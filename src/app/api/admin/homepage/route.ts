import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";

export async function PUT(request: Request) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
  const body = await request.json();
  const { hero, stats } = body as {
    hero: {
      kicker: string;
      headline: string[];
      subheading: string;
      backgroundImage?: string;
      ctaPrimary?: { label: string; href: string };
      ctaSecondary?: { label: string; href: string };
    };
    stats: Array<{
      id?: string;
      value: number;
      suffix?: string;
      prefix?: string;
      label: string;
      detail: string;
    }>;
  };

  const existingHero = await prisma.heroSection.findFirst();
  if (existingHero) {
    await prisma.heroSection.update({
      where: { id: existingHero.id },
      data: {
        kicker: hero.kicker,
        headline: hero.headline,
        subheading: hero.subheading,
        backgroundImage: hero.backgroundImage || null,
        ctaPrimary: hero.ctaPrimary ?? undefined,
        ctaSecondary: hero.ctaSecondary ?? undefined,
        status: "PUBLISHED",
      },
    });
  } else {
    await prisma.heroSection.create({
      data: {
        kicker: hero.kicker,
        headline: hero.headline,
        subheading: hero.subheading,
        backgroundImage: hero.backgroundImage || null,
        ctaPrimary: hero.ctaPrimary ?? undefined,
        ctaSecondary: hero.ctaSecondary ?? undefined,
        status: "PUBLISHED",
      },
    });
  }

  for (let i = 0; i < stats.length; i++) {
    const s = stats[i];
    if (s.id) {
      await prisma.stat.update({
        where: { id: s.id },
        data: {
          value: s.value,
          suffix: s.suffix || null,
          prefix: s.prefix || null,
          label: s.label,
          detail: s.detail,
          sortOrder: i,
          status: "PUBLISHED",
        },
      });
    } else {
      await prisma.stat.create({
        data: {
          value: s.value,
          suffix: s.suffix || null,
          prefix: s.prefix || null,
          label: s.label,
          detail: s.detail,
          sortOrder: i,
          status: "PUBLISHED",
        },
      });
    }
  }

  await logActivity(
    authResult.session.user.id,
    "updated",
    "homepage",
    undefined,
    { statsCount: stats.length },
  );

  return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "Database unavailable. Start MySQL locally and run npm run db:setup, or use the VPS admin panel.",
      },
      { status: 503 },
    );
  }
}

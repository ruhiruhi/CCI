import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import { dbUnavailableResponse } from "@/lib/admin-content";
import type { ContentStatus, Prisma } from "@prisma/client";

type TimelineInput = {
  id?: string;
  year: string;
  title: string;
  body: string;
  image: string;
};

type PillarInput = {
  id?: string;
  index: string;
  title: string;
  tagline: string;
  body: string;
  points: string[];
  image: string;
};

export async function PUT(request: Request) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const body = (await request.json()) as {
      timeline?: TimelineInput[];
      pillars?: PillarInput[];
      status?: ContentStatus;
    };

    const status = body.status ?? "PUBLISHED";
    const timeline = body.timeline ?? [];
    const pillars = body.pillars ?? [];

    const existingTimeline = await prisma.timelineItem.findMany();
    const keepTimelineIds = new Set(
      timeline.map((t) => t.id).filter(Boolean) as string[],
    );

    for (const row of existingTimeline) {
      if (!keepTimelineIds.has(row.id)) {
        await prisma.timelineItem.delete({ where: { id: row.id } });
      }
    }

    for (let i = 0; i < timeline.length; i++) {
      const t = timeline[i];
      const data = {
        year: String(t.year ?? "").trim(),
        title: String(t.title ?? "").trim(),
        body: String(t.body ?? "").trim(),
        image: String(t.image ?? "").trim(),
        sortOrder: i,
        status,
      };
      if (!data.year || !data.title) continue;
      if (t.id) {
        await prisma.timelineItem.update({ where: { id: t.id }, data });
      } else {
        await prisma.timelineItem.create({ data });
      }
    }

    const existingPillars = await prisma.pillar.findMany();
    const keepPillarIds = new Set(
      pillars.map((p) => p.id).filter(Boolean) as string[],
    );

    for (const row of existingPillars) {
      if (!keepPillarIds.has(row.id)) {
        await prisma.pillar.delete({ where: { id: row.id } });
      }
    }

    for (let i = 0; i < pillars.length; i++) {
      const p = pillars[i];
      const data = {
        index: String(p.index ?? String(i + 1).padStart(2, "0")).trim(),
        title: String(p.title ?? "").trim(),
        tagline: String(p.tagline ?? "").trim(),
        body: String(p.body ?? "").trim(),
        points: (Array.isArray(p.points) ? p.points : []) as Prisma.InputJsonValue,
        image: String(p.image ?? "").trim(),
        sortOrder: i,
        status,
      };
      if (!data.title) continue;
      if (p.id) {
        await prisma.pillar.update({ where: { id: p.id }, data });
      } else {
        await prisma.pillar.create({ data });
      }
    }

    await logActivity(authResult.session.user.id, "updated", "about", undefined, {
      timelineCount: timeline.length,
      pillarsCount: pillars.length,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

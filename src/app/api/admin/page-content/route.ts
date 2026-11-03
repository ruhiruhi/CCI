import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import { dbUnavailableResponse } from "@/lib/admin-content";
import type { ContentStatus, Prisma } from "@prisma/client";

const ALLOWED_PAGES = new Set(["catalogue", "our-activities"]);

export async function GET(request: Request) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const page = new URL(request.url).searchParams.get("page") ?? "";
    if (!ALLOWED_PAGES.has(page)) {
      return NextResponse.json(
        { error: "Invalid page key. Use catalogue or our-activities." },
        { status: 400 },
      );
    }

    const row = await prisma.pageContent.findFirst({
      where: { page },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      page,
      sections: row?.sections ?? null,
      status: row?.status ?? "PUBLISHED",
      id: row?.id ?? null,
    });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

export async function PUT(request: Request) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const body = (await request.json()) as {
      page?: string;
      sections?: unknown;
      status?: ContentStatus;
    };

    const page = String(body.page ?? "").trim();
    if (!ALLOWED_PAGES.has(page)) {
      return NextResponse.json(
        { error: "Invalid page key. Use catalogue or our-activities." },
        { status: 400 },
      );
    }
    if (body.sections == null || typeof body.sections !== "object") {
      return NextResponse.json(
        { error: "sections payload is required." },
        { status: 400 },
      );
    }

    const status = body.status ?? "PUBLISHED";
    const sections = body.sections as Prisma.InputJsonValue;

    const existing = await prisma.pageContent.findFirst({ where: { page } });
    let row;
    if (existing) {
      row = await prisma.pageContent.update({
        where: { id: existing.id },
        data: { sections, status },
      });
    } else {
      row = await prisma.pageContent.create({
        data: { page, sections, status },
      });
    }

    await logActivity(
      authResult.session.user.id,
      existing ? "updated" : "created",
      "page-content",
      row.id,
      { page },
    );

    return NextResponse.json({ ok: true, id: row.id });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

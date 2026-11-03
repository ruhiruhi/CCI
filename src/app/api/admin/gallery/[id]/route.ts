import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import {
  dbUnavailableResponse,
  normalizeGalleryBody,
} from "@/lib/admin-content";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    const item = await prisma.galleryItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const data = normalizeGalleryBody(body);
    if ("error" in data) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    const item = await prisma.galleryItem.update({ where: { id }, data });
    await logActivity(
      authResult.session.user.id,
      "updated",
      "gallery",
      item.id,
    );
    return NextResponse.json({ ok: true, item });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    await prisma.galleryItem.delete({ where: { id } });
    await logActivity(authResult.session.user.id, "deleted", "gallery", id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

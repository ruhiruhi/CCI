import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import {
  dbUnavailableResponse,
  normalizeEventBody,
} from "@/lib/admin-content";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    const item = await prisma.event.findUnique({ where: { id } });
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
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const data = normalizeEventBody(body, existing.slug);
    if ("error" in data) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    const item = await prisma.event.update({ where: { id }, data });
    await logActivity(
      authResult.session.user.id,
      "updated",
      "event",
      item.id,
    );
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "An event with this slug already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    await prisma.event.delete({ where: { id } });
    await logActivity(authResult.session.user.id, "deleted", "event", id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

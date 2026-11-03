import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import { dbUnavailableResponse } from "@/lib/admin-content";
import { supportItemSchema } from "@/lib/support-validation";
import {
  deleteSupportItem,
  updateSupportItem,
} from "@/lib/support-service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    const item = await prisma.supportItem.findUnique({ where: { id } });
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
    const parsed = supportItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const item = await updateSupportItem(id, parsed.data);
    await logActivity(
      authResult.session.user.id,
      "updated",
      "support-item",
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
    await deleteSupportItem(id);
    await logActivity(
      authResult.session.user.id,
      "deleted",
      "support-item",
      id,
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

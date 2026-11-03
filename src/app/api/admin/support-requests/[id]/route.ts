import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import { dbUnavailableResponse } from "@/lib/admin-content";
import { SUPPORT_REQUEST_STATUSES } from "@/lib/support";
import {
  deleteSupportRequest,
  updateSupportRequestStatus,
} from "@/lib/support-service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    const item = await prisma.supportRequest.findUnique({
      where: { id },
      include: { supportItem: true },
    });
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
    const body = (await request.json()) as {
      status?: string;
      adminNotes?: string | null;
    };

    if (
      !body.status ||
      !(SUPPORT_REQUEST_STATUSES as readonly string[]).includes(body.status)
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const item = await updateSupportRequestStatus(
      id,
      body.status as (typeof SUPPORT_REQUEST_STATUSES)[number],
      body.adminNotes,
    );

    await logActivity(
      authResult.session.user.id,
      "updated",
      "support-request",
      id,
      { status: body.status },
    );

    return NextResponse.json({ ok: true, item });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    if (msg.includes("not found")) {
      return NextResponse.json({ error: msg }, { status: 404 });
    }
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    await deleteSupportRequest(id);
    await logActivity(
      authResult.session.user.id,
      "deleted",
      "support-request",
      id,
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    if (msg.includes("not found")) {
      return NextResponse.json({ error: msg }, { status: 404 });
    }
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

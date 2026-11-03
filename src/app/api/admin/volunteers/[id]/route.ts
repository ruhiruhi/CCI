import { NextResponse } from "next/server";
import { requireVolunteerManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import { dbUnavailableResponse } from "@/lib/admin-content";
import { updateVolunteerStatusSchema } from "@/lib/volunteer-validation";
import {
  deleteVolunteer,
  getVolunteerById,
  updateVolunteerStatus,
  VolunteerNotFoundError,
} from "@/lib/volunteer-service";
import { sendVolunteerApprovedEmail } from "@/lib/volunteer-email";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const authResult = await requireVolunteerManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    const item = await getVolunteerById(id);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  const authResult = await requireVolunteerManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = updateVolunteerStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid status." },
        { status: 400 },
      );
    }

    const existing = await getVolunteerById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const item = await updateVolunteerStatus(id, parsed.data);

    if (
      parsed.data.status === "APPROVED" &&
      existing.status !== "APPROVED"
    ) {
      void sendVolunteerApprovedEmail(item).catch((err) =>
        console.error("[volunteer-email] approve failed", err),
      );
    }

    await logActivity(
      authResult.session.user.id,
      "updated",
      "volunteer",
      id,
      { status: parsed.data.status },
    );

    return NextResponse.json({ ok: true, item });
  } catch (e) {
    if (e instanceof VolunteerNotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const authResult = await requireVolunteerManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    await deleteVolunteer(id);
    await logActivity(
      authResult.session.user.id,
      "deleted",
      "volunteer",
      id,
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof VolunteerNotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { updateLeadSchema } from "@/lib/lead-validation";
import { deleteLead, getLeadById, updateLead } from "@/lib/lead-service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  try {
    const lead = await getLeadById(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }
    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Get lead failed:", error);
    return NextResponse.json({ error: "Could not load lead." }, { status: 500 });
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = updateLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid update." },
      { status: 400 },
    );
  }

  try {
    const existing = await getLeadById(id);
    if (!existing) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }
    const lead = await updateLead(id, parsed.data);
    return NextResponse.json({ ok: true, lead });
  } catch (error) {
    console.error("Update lead failed:", error);
    return NextResponse.json(
      { error: "Could not update lead." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  try {
    const existing = await getLeadById(id);
    if (!existing) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }
    await deleteLead(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete lead failed:", error);
    return NextResponse.json(
      { error: "Could not delete lead." },
      { status: 500 },
    );
  }
}

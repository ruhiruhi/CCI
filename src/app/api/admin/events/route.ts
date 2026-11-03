import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import {
  dbUnavailableResponse,
  normalizeEventBody,
} from "@/lib/admin-content";

export async function GET() {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const items = await prisma.event.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

export async function POST(request: Request) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const body = await request.json();
    const data = normalizeEventBody(body);
    if ("error" in data) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    const item = await prisma.event.create({ data });
    await logActivity(
      authResult.session.user.id,
      "created",
      "event",
      item.id,
    );
    return NextResponse.json({ ok: true, item }, { status: 201 });
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

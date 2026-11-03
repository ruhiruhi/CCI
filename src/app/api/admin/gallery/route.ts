import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import {
  dbUnavailableResponse,
  normalizeGalleryBody,
} from "@/lib/admin-content";

export async function GET() {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
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
    const data = normalizeGalleryBody(body);
    if ("error" in data) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    const item = await prisma.galleryItem.create({ data });
    await logActivity(
      authResult.session.user.id,
      "created",
      "gallery",
      item.id,
    );
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

import { NextResponse } from "next/server";
import { requireContentManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import { dbUnavailableResponse } from "@/lib/admin-content";
import { supportItemSchema } from "@/lib/support-validation";
import {
  createSupportItem,
  getSupportStats,
  listSupportItems,
} from "@/lib/support-service";

export async function GET(request: Request) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("stats") === "1") {
      const stats = await getSupportStats();
      return NextResponse.json({ stats });
    }

    const result = await listSupportItems({
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      priority: (searchParams.get("priority") as never) || undefined,
      status: (searchParams.get("status") as never) || undefined,
      page: Number(searchParams.get("page") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 20),
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

export async function POST(request: Request) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const body = await request.json();
    const parsed = supportItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const item = await createSupportItem(parsed.data);
    await logActivity(
      authResult.session.user.id,
      "created",
      "support-item",
      item.id,
    );
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}

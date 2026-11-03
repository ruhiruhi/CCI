import { NextResponse } from "next/server";
import {
  assertSameOrigin,
  clientIp,
  rateLimit,
} from "@/lib/lead-security";
import { supportRequestSchema } from "@/lib/support-validation";
import { createSupportRequest } from "@/lib/support-service";
import { sendSupportRequestEmails } from "@/lib/support-email";
import { getOpenSupportItems } from "@/lib/support-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getOpenSupportItems({
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      priority: (searchParams.get("priority") as never) || undefined,
      status: (searchParams.get("status") as never) || "OPEN",
      page: Number(searchParams.get("page") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 24),
      sort: (searchParams.get("sort") as never) || "newest",
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Unable to load support items." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(request);
  const limited = rateLimit(`support:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const parsed = supportRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { agreeContact: _, ...data } = parsed.data;
    const created = await createSupportRequest(data, ip);
    void sendSupportRequestEmails(created);

    return NextResponse.json(
      { ok: true, id: created.id },
      { status: 201 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Submission failed";
    if (
      msg.includes("closed") ||
      msg.includes("remaining") ||
      msg.includes("not found")
    ) {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Could not save your request. Please try again." },
      { status: 503 },
    );
  }
}

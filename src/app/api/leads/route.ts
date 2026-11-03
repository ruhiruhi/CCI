import { NextResponse } from "next/server";
import { createLeadSchema } from "@/lib/lead-validation";
import { createLead } from "@/lib/lead-service";
import { sendLeadEmails } from "@/lib/lead-email";
import {
  assertSameOrigin,
  clientIp,
  rateLimit,
} from "@/lib/lead-security";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const ip = clientIp(request);
  const limited = rateLimit(`lead:${ip}`, 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createLeadSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Please check the form fields.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const lead = await createLead({ ...parsed.data, ipAddress: ip });

    // Fire-and-forget email (never block success on mail failure)
    void sendLeadEmails(lead).catch((err) =>
      console.error("[lead-email] failed", err),
    );

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Lead create failed:", error);
    return NextResponse.json(
      { error: "Could not save your details. Please try again later." },
      { status: 500 },
    );
  }
}

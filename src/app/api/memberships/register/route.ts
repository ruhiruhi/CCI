import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/leads";

export const runtime = "nodejs";

/**
 * Public Join CCI membership application.
 * Admin approves in /admin/memberships; email ID card + map sync
 * require SMTP / RESEND_API_KEY (TODO placeholders in volunteer-email).
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = sanitizeText(String(form.get("name") ?? ""), 120);
    const email = sanitizeText(String(form.get("email") ?? ""), 180).toLowerCase();
    const phone = sanitizeText(String(form.get("phone") ?? ""), 40);
    const city = sanitizeText(String(form.get("city") ?? ""), 80);
    const organization = sanitizeText(String(form.get("organization") ?? ""), 160);
    const interest = sanitizeText(String(form.get("interest") ?? "Join the Movement"), 80);
    const message = sanitizeText(String(form.get("message") ?? ""), 2000);

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 },
      );
    }

    const type =
      interest.toLowerCase().includes("partner")
        ? "INSTITUTIONAL"
        : interest.toLowerCase().includes("student")
          ? "STUDENT"
          : interest.toLowerCase().includes("volunteer")
            ? "VOLUNTEER"
            : "INDIVIDUAL";

    const application = await prisma.membershipApplication.create({
      data: {
        name,
        email,
        phone,
        type: type as "INDIVIDUAL" | "INSTITUTIONAL" | "STUDENT" | "VOLUNTEER" | "SUPPORTING",
        org: organization || city || null,
        message: [city && `City: ${city}`, interest && `Interest: ${interest}`, message]
          .filter(Boolean)
          .join("\n"),
        status: "PENDING",
      },
    });

    // Also store as lead for CRM visibility
    await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        city: city || null,
        organization: organization || null,
        interest: interest || "Join the Movement",
        message: message || null,
        sourcePage: "/join",
        buttonName: "Join CCI",
        pageUrl: "https://consciouscine.org/join",
        status: "NEW",
      },
    }).catch(() => null);

    return NextResponse.json({
      id: application.id,
      message:
        "Application received. Our team will review and email you after approval.",
    });
  } catch (err) {
    console.error("[memberships/register]", err);
    return NextResponse.json(
      { error: "Could not submit application. Please try again." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { isContactRole } from "@/lib/contact";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, role, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  if (typeof role !== "string" || !isContactRole(role)) {
    return NextResponse.json({ error: "Please select who you are." }, { status: 400 });
  }

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const trimmedName = name.trim().slice(0, 255);
  const trimmedEmail = email.trim().slice(0, 255);
  const trimmedMessage = message.trim().slice(0, 5000);

  try {
    const submission = await prisma.contactSubmission.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        role,
        message: trimmedMessage,
      },
    });

    return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("Contact submission failed:", error);
    return NextResponse.json(
      { error: "Could not save your message. Please try again later." },
      { status: 500 },
    );
  }
}

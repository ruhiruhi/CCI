import type { Lead } from "@prisma/client";

/**
 * Lightweight email notifier.
 * If SMTP_* / EMAIL_* env vars are missing, logs instead of failing the request.
 */
export async function sendLeadEmails(lead: Lead): Promise<void> {
  const adminTo =
    process.env.LEAD_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_FROM;

  const subjectUser = "We received your message — Conscious Cinema Initiative";
  const subjectAdmin = `New lead: ${lead.interest} — ${lead.name}`;

  const userBody = [
    `Hi ${lead.name},`,
    "",
    "Thank you for reaching out to the Conscious Cinema Initiative.",
    "We have received your details and a member of our team will be in touch soon.",
    "",
    `Interest: ${lead.interest}`,
    lead.message ? `Message: ${lead.message}` : "",
    "",
    "With care,",
    "CCI Team",
  ]
    .filter(Boolean)
    .join("\n");

  const adminBody = [
    "New lead submitted",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Interest: ${lead.interest}`,
    `City: ${lead.city ?? "—"}`,
    `Organization: ${lead.organization ?? "—"}`,
    `Message: ${lead.message ?? "—"}`,
    `Source page: ${lead.sourcePage ?? "—"}`,
    `Button: ${lead.buttonName ?? "—"}`,
    `URL: ${lead.pageUrl ?? "—"}`,
    `Submitted: ${lead.createdAt.toISOString()}`,
  ].join("\n");

  // Prefer Resend HTTP API when available (no extra dependency required)
  const resendKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    "CCI <onboarding@resend.dev>";

  if (resendKey) {
    await Promise.allSettled([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [lead.email],
          subject: subjectUser,
          text: userBody,
        }),
      }),
      adminTo
        ? fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from,
              to: [adminTo],
              subject: subjectAdmin,
              text: adminBody,
            }),
          })
        : Promise.resolve(),
    ]);
    return;
  }

  // Soft-fail: keep lead creation successful even without mail config
  console.info("[lead-email] Mail provider not configured. Lead saved:", {
    id: lead.id,
    email: lead.email,
    interest: lead.interest,
    adminTo,
  });
}

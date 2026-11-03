import type { SupportItem, SupportRequest } from "@prisma/client";

type RequestWithItem = SupportRequest & { supportItem: SupportItem };

async function sendViaResend(opts: {
  to: string;
  subject: string;
  text: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    "CCI <onboarding@resend.dev>";

  if (!resendKey) {
    console.info("[support-email]", opts.subject, "→", opts.to);
    console.info(opts.text);
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
    }),
  });
}

export async function sendSupportRequestEmails(
  request: RequestWithItem,
): Promise<void> {
  const adminTo =
    process.env.LEAD_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_FROM;

  const item = request.supportItem;

  const userBody = [
    `Hi ${request.fullName},`,
    "",
    "Thank you for offering to support the Conscious Cinema Initiative.",
    "We have received your pledge and our team will follow up shortly.",
    "",
    `Support item: ${item.title}`,
    `Quantity: ${request.quantityToDonate} ${item.unit}`,
    request.message ? `Message: ${request.message}` : "",
    "",
    "With gratitude,",
    "CCI Team",
  ]
    .filter(Boolean)
    .join("\n");

  const adminBody = [
    "New support pledge submitted",
    "",
    `Item: ${item.title}`,
    `Category: ${item.category}`,
    `Quantity pledged: ${request.quantityToDonate} ${item.unit}`,
    "",
    `Name: ${request.fullName}`,
    `Email: ${request.email}`,
    `Phone: ${request.phone}`,
    `Address: ${request.address}`,
    `City: ${request.city}`,
    `State: ${request.state}`,
    `Country: ${request.country}`,
    `Pincode: ${request.pincode}`,
    `Message: ${request.message ?? "—"}`,
    `Submitted: ${request.createdAt.toISOString()}`,
  ].join("\n");

  await Promise.allSettled([
    sendViaResend({
      to: request.email,
      subject: `Thank you for supporting — ${item.title}`,
      text: userBody,
    }),
    adminTo
      ? sendViaResend({
          to: adminTo,
          subject: `Support pledge: ${item.title} — ${request.fullName}`,
          text: adminBody,
        })
      : Promise.resolve(),
  ]);
}

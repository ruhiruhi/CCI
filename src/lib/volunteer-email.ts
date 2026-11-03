import type { VolunteerApplication } from "@prisma/client";
import {
  SITE_URL,
  VOLUNTEER_STATUS_LABELS,
  type VolunteerStatusFilter,
} from "@/lib/volunteer";

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
    console.info("[volunteer-email]", opts.subject, "→", opts.to);
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

export async function sendVolunteerWelcomeEmail(
  volunteer: VolunteerApplication,
): Promise<void> {
  const adminTo =
    process.env.LEAD_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_FROM;

  const idCardUrl = `${SITE_URL}/volunteer/id-card/${volunteer.id}`;
  const statusLabel =
    VOLUNTEER_STATUS_LABELS[volunteer.status as VolunteerStatusFilter] ??
    volunteer.status;

  const userBody = [
    `Hi ${volunteer.name},`,
    "",
    "Welcome to Conscious Cinema Initiative.",
    "",
    "Thank you for joining us as a volunteer. Every screening begins a conversation — and you are now part of that circle.",
    "",
    `Your Volunteer ID: ${volunteer.volunteerId}`,
    `Status: ${statusLabel}`,
    "",
    `View your Digital ID Card: ${idCardUrl}`,
    "",
    `Visit us: ${SITE_URL}`,
    "",
    "With gratitude,",
    "Conscious Cinema Initiative",
  ].join("\n");

  const adminBody = [
    "New volunteer registration",
    "",
    `Volunteer ID: ${volunteer.volunteerId}`,
    `Name: ${volunteer.name}`,
    `Email: ${volunteer.email}`,
    `Phone: ${volunteer.phone}`,
    `Interest: ${volunteer.interest}`,
    `Message: ${volunteer.message ?? "—"}`,
    `Joined: ${volunteer.joinedAt.toISOString()}`,
  ].join("\n");

  await Promise.allSettled([
    sendViaResend({
      to: volunteer.email,
      subject: "Welcome to Conscious Cinema Initiative",
      text: userBody,
    }),
    adminTo
      ? sendViaResend({
          to: adminTo,
          subject: `New volunteer: ${volunteer.volunteerId} — ${volunteer.name}`,
          text: adminBody,
        })
      : Promise.resolve(),
  ]);
}

export async function sendVolunteerApprovedEmail(
  volunteer: VolunteerApplication,
): Promise<void> {
  const idCardUrl = `${SITE_URL}/volunteer/id-card/${volunteer.id}`;

  const body = [
    `Hi ${volunteer.name},`,
    "",
    "Congratulations!",
    "",
    "Your volunteer registration has been approved.",
    "",
    `Volunteer ID: ${volunteer.volunteerId}`,
    `Digital ID Card: ${idCardUrl}`,
    "",
    `Website: ${SITE_URL}`,
    "",
    "We look forward to screening — and conversing — with you.",
    "",
    "Conscious Cinema Initiative",
  ].join("\n");

  await sendViaResend({
    to: volunteer.email,
    subject: "Congratulations! Your volunteer registration has been approved",
    text: body,
  });
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/header";
import { StatusBadge } from "@/components/admin/data-table";
import { VolunteerDetailActions } from "@/components/admin/volunteer-detail-actions";
import { getVolunteerById } from "@/lib/volunteer-service";
import {
  VOLUNTEER_STATUS_LABELS,
  type VolunteerStatusFilter,
} from "@/lib/volunteer";

type Props = { params: Promise<{ id: string }> };

export default async function VolunteerDetailPage({ params }: Props) {
  const { id } = await params;
  const volunteer = await getVolunteerById(id).catch(() => null);
  if (!volunteer) notFound();

  const statusLabel =
    VOLUNTEER_STATUS_LABELS[volunteer.status as VolunteerStatusFilter] ??
    volunteer.status;

  const fields: [string, string][] = [
    ["Volunteer ID", volunteer.volunteerId],
    ["Full Name", volunteer.name],
    ["Email", volunteer.email],
    ["Phone", volunteer.phone],
    ["Interest", volunteer.interest],
    ["Status", statusLabel],
    ["Joined Date", format(volunteer.joinedAt, "dd MMM yyyy")],
    ["Created", format(volunteer.createdAt, "dd MMM yyyy HH:mm")],
    ["Message", volunteer.message ?? "—"],
    ["Notes", volunteer.notes ?? "—"],
  ];

  return (
    <>
      <AdminHeader title={volunteer.volunteerId} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4">
          <Link
            href="/admin/volunteers"
            className="text-sm text-gold hover:underline"
          >
            ← Back to registrations
          </Link>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-warm/10 bg-ink-soft/50 px-5 py-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-1 ring-gold/35">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={volunteer.profilePhoto || "/logo.jpeg"}
                alt={volunteer.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-warm">
                    {volunteer.name}
                  </h2>
                  <p className="mt-1 font-mono text-sm text-gold">
                    {volunteer.volunteerId}
                  </p>
                </div>
                <StatusBadge status={volunteer.status} />
              </div>
            </div>
          </div>

          <dl className="grid gap-4 rounded-2xl border border-warm/10 bg-ink-soft/40 p-6 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div
                key={label}
                className={
                  label === "Message" || label === "Notes" ? "sm:col-span-2" : ""
                }
              >
                <dt className="text-xs uppercase tracking-wider text-mist">
                  {label}
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-warm">{value}</dd>
              </div>
            ))}
          </dl>

          <VolunteerDetailActions
            id={volunteer.id}
            status={volunteer.status}
            profilePhoto={volunteer.profilePhoto}
          />
        </div>
      </div>
    </>
  );
}

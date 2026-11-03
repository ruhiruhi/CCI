import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/header";
import { Badge } from "@/components/ui/badge";
import { getLeadById } from "@/lib/lead-service";
import { LEAD_STATUS_LABELS, type LeadStatusValue } from "@/lib/leads";
import { LeadDetailActions } from "@/components/admin/lead-detail-actions";

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let lead = null;
  try {
    lead = await getLeadById(id);
  } catch {
    /* DB offline */
  }
  if (!lead) notFound();

  const status = lead.status as LeadStatusValue;

  return (
    <>
      <AdminHeader title={lead.name} />
      <div className="flex-1 overflow-y-auto p-6">
        <Link
          href="/admin/leads"
          className="text-sm text-mist transition-colors hover:text-gold"
        >
          ← Back to leads
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-warm/10 bg-charcoal/40 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{LEAD_STATUS_LABELS[status]}</Badge>
              <span className="text-sm text-mist">
                {format(lead.createdAt, "dd MMM yyyy, HH:mm")}
              </span>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Email", lead.email],
                ["Phone", lead.phone],
                ["City", lead.city ?? "—"],
                ["Organization", lead.organization ?? "—"],
                ["Interest", lead.interest],
                ["Button", lead.buttonName ?? "—"],
                ["Source page", lead.sourcePage ?? "—"],
                ["IP", lead.ipAddress ?? "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-[0.16em] text-mist">
                    {label}
                  </dt>
                  <dd className="mt-1 text-warm">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.16em] text-mist">
                Message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-cloud">
                {lead.message ?? "—"}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.16em] text-mist">
                Page URL
              </p>
              <p className="mt-2 break-all text-sm text-cloud">
                {lead.pageUrl ?? "—"}
              </p>
            </div>
          </div>

          <LeadDetailActions
            id={lead.id}
            status={status}
            remarks={lead.remarks ?? ""}
          />
        </div>
      </div>
    </>
  );
}

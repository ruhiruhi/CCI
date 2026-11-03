import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";

export default async function DonationsAdminPage() {
  let campaigns: Awaited<ReturnType<typeof prisma.donationCampaign.findMany>> = [];
  try {
    campaigns = await prisma.donationCampaign.findMany({ orderBy: { sortOrder: "asc" } });
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="Donation Campaigns" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={campaigns}
          columns={[
            { key: "title", label: "Campaign" },
            {
              key: "raised",
              label: "Raised",
              render: (c) => `₹${c.raised.toLocaleString()} / ₹${c.goal.toLocaleString()}`,
            },
            { key: "supporters", label: "Supporters" },
            {
              key: "status",
              label: "Status",
              render: (c) => <StatusBadge status={c.status} />,
            },
          ]}
        />
      </div>
    </>
  );
}

import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";

export default async function PartnersAdminPage() {
  let partners: Awaited<ReturnType<typeof prisma.partner.findMany>> = [];
  try {
    partners = await prisma.partner.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Partners" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={partners}
          columns={[
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
            {
              key: "website",
              label: "Website",
              render: (p) => p.website ?? "—",
            },
            {
              key: "status",
              label: "Status",
              render: (p) => <StatusBadge status={p.status} />,
            },
          ]}
        />
      </div>
    </>
  );
}

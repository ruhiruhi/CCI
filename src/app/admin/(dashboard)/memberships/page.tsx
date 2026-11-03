import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";

export default async function MembershipsAdminPage() {
  let memberships: Awaited<
    ReturnType<typeof prisma.membershipApplication.findMany>
  > = [];
  try {
    memberships = await prisma.membershipApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Membership Applications" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={memberships}
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "type", label: "Type" },
            { key: "org", label: "Organisation" },
            {
              key: "status",
              label: "Status",
              render: (m) => <StatusBadge status={m.status} />,
            },
          ]}
        />
      </div>
    </>
  );
}

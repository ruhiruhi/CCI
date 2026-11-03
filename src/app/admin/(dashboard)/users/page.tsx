import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/admin-api";

export default async function UsersAdminPage() {
  let users: Awaited<ReturnType<typeof prisma.user.findMany>> = [];
  try {
    users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="User Management" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={users}
          columns={[
            { key: "name", label: "Name", render: (u) => u.name ?? "—" },
            { key: "email", label: "Email" },
            {
              key: "role",
              label: "Role",
              render: (u) => <Badge variant="gold">{ROLE_LABELS[u.role]}</Badge>,
            },
            {
              key: "active",
              label: "Status",
              render: (u) =>
                u.active ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="danger">Inactive</Badge>
                ),
            },
          ]}
          emptyMessage="No users. Run database seed to create admin accounts."
        />
      </div>
    </>
  );
}

import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export default async function ActivityAdminPage() {
  let logs: Awaited<
    ReturnType<
      typeof prisma.activityLog.findMany<{
        include: { user: { select: { name: true; email: true } } };
      }>
    >
  > = [];

  try {
    logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { name: true, email: true } } },
    });
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="Activity Log" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={logs}
          columns={[
            { key: "action", label: "Action" },
            { key: "entity", label: "Entity" },
            {
              key: "user",
              label: "User",
              render: (l) => l.user?.name ?? l.user?.email ?? "System",
            },
            {
              key: "createdAt",
              label: "When",
              render: (l) => formatDistanceToNow(l.createdAt, { addSuffix: true }),
            },
          ]}
        />
      </div>
    </>
  );
}

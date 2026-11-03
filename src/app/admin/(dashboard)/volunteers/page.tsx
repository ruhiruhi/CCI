import { AdminHeader } from "@/components/admin/header";
import { VolunteersManager } from "@/components/admin/volunteers-manager";
import { prisma } from "@/lib/prisma";

export default async function VolunteersAdminPage() {
  let items: Awaited<
    ReturnType<typeof prisma.volunteerApplication.findMany>
  > = [];
  let stats = { total: 0, pending: 0, approved: 0, rejected: 0 };

  try {
    const [rows, total, pending, approved, rejected] = await Promise.all([
      prisma.volunteerApplication.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.volunteerApplication.count(),
      prisma.volunteerApplication.count({ where: { status: "PENDING" } }),
      prisma.volunteerApplication.count({ where: { status: "APPROVED" } }),
      prisma.volunteerApplication.count({ where: { status: "REJECTED" } }),
    ]);
    items = rows;
    stats = { total, pending, approved, rejected };
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Volunteer Registrations" />
      <div className="flex-1 overflow-y-auto p-6">
        <VolunteersManager initialItems={items} initialStats={stats} />
      </div>
    </>
  );
}

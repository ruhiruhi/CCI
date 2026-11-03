import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";

export default async function TestimonialsAdminPage() {
  let items: Awaited<ReturnType<typeof prisma.testimonial.findMany>> = [];
  try {
    items = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="Testimonials" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={items}
          columns={[
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
            { key: "approved", label: "Approved", render: (t) => (t.approved ? "Yes" : "No") },
            { key: "status", label: "Status", render: (t) => <StatusBadge status={t.status} /> },
          ]}
        />
      </div>
    </>
  );
}

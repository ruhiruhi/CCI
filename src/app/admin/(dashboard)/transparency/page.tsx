import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";

export default async function TransparencyAdminPage() {
  let records: Awaited<ReturnType<typeof prisma.transparencyRecord.findMany>> = [];
  try {
    records = await prisma.transparencyRecord.findMany({ orderBy: { sortOrder: "asc" } });
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="Transparency Centre" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={records}
          columns={[
            { key: "category", label: "Category" },
            { key: "title", label: "Title" },
            { key: "value", label: "Value" },
            { key: "year", label: "Year", render: (r) => r.year ?? "—" },
          ]}
          emptyMessage="No transparency records yet. Add funds, equipment, and impact reports."
        />
      </div>
    </>
  );
}

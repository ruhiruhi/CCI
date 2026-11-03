import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";

export default async function StoriesAdminPage() {
  let stories: Awaited<ReturnType<typeof prisma.communityStory.findMany>> = [];
  try {
    stories = await prisma.communityStory.findMany({ orderBy: { sortOrder: "asc" } });
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="Community Stories" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={stories}
          columns={[
            { key: "name", label: "Name" },
            { key: "location", label: "Location" },
            { key: "featured", label: "Featured", render: (s) => (s.featured ? "Yes" : "No") },
            { key: "status", label: "Status", render: (s) => <StatusBadge status={s.status} /> },
          ]}
        />
      </div>
    </>
  );
}

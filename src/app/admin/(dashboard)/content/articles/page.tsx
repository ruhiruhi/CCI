import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";

export default async function ArticlesAdminPage() {
  let articles: Awaited<ReturnType<typeof prisma.article.findMany>> = [];
  try {
    articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="Film Literacy Articles" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={articles}
          columns={[
            { key: "title", label: "Title" },
            { key: "category", label: "Category" },
            { key: "author", label: "Author" },
            { key: "status", label: "Status", render: (a) => <StatusBadge status={a.status} /> },
          ]}
        />
      </div>
    </>
  );
}

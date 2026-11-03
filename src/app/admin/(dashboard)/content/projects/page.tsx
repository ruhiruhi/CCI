import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function ProjectsAdminPage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Projects" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-mist">
            Manage Our Work projects and impact stories.
          </p>
          <Link
            href="/admin/content/projects/new"
            className={cn(buttonVariants({ variant: "gold" }), "gap-2")}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>

        <AdminDataTable
          rows={projects}
          editHref={(p) => `/admin/content/projects/${p.id}`}
          columns={[
            { key: "title", label: "Title" },
            { key: "category", label: "Category" },
            { key: "location", label: "Location" },
            {
              key: "status",
              label: "Status",
              render: (p) => <StatusBadge status={p.status} />,
            },
          ]}
          emptyMessage="No projects yet. Create your first project or run the database seed."
        />
      </div>
    </>
  );
}

import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export default async function MediaAdminPage() {
  let assets: Awaited<ReturnType<typeof prisma.mediaAsset.findMany>> = [];
  try {
    assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="Media Library" />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="mb-6 text-sm text-mist">
          Centralized media manager. Connect Cloudinary in Settings for cloud uploads.
        </p>
        <AdminDataTable
          rows={assets}
          columns={[
            { key: "filename", label: "File" },
            { key: "type", label: "Type" },
            { key: "folder", label: "Folder" },
            {
              key: "createdAt",
              label: "Uploaded",
              render: (a) => formatDistanceToNow(a.createdAt, { addSuffix: true }),
            },
          ]}
          emptyMessage="No media uploaded yet."
        />
      </div>
    </>
  );
}

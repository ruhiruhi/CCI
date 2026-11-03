import { AdminHeader } from "@/components/admin/header";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { prisma } from "@/lib/prisma";

export default async function GalleryAdminPage() {
  let items: Awaited<ReturnType<typeof prisma.galleryItem.findMany>> = [];
  try {
    items = await prisma.galleryItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Gallery" />
      <div className="flex-1 overflow-y-auto p-6">
        <GalleryManager items={items} />
      </div>
    </>
  );
}

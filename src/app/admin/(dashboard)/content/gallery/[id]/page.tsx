import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { GalleryEditor } from "@/components/admin/editors/gallery-editor";
import { prisma } from "@/lib/prisma";

export default async function GalleryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let item = null;
  try {
    item = await prisma.galleryItem.findUnique({ where: { id } });
  } catch {
    /* DB not ready */
  }
  if (!item) notFound();

  return (
    <>
      <AdminHeader title="Edit gallery item" />
      <div className="flex-1 overflow-y-auto p-6">
        <GalleryEditor initial={item} />
      </div>
    </>
  );
}

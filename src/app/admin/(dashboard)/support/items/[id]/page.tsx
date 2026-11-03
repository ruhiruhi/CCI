import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { SupportItemEditor } from "@/components/admin/editors/support-item-editor";
import { prisma } from "@/lib/prisma";

export default async function EditSupportItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let item = null;
  try {
    item = await prisma.supportItem.findUnique({ where: { id } });
  } catch {
    /* DB not ready */
  }
  if (!item) notFound();

  return (
    <>
      <AdminHeader title="Edit Support Item" />
      <div className="flex-1 overflow-y-auto p-6">
        <SupportItemEditor initial={item} />
      </div>
    </>
  );
}

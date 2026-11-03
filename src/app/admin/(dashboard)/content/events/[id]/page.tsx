import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { EventEditor } from "@/components/admin/editors/event-editor";
import { prisma } from "@/lib/prisma";

export default async function EventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let item = null;
  try {
    item = await prisma.event.findUnique({ where: { id } });
  } catch {
    /* DB not ready */
  }
  if (!item) notFound();

  return (
    <>
      <AdminHeader title="Edit event" />
      <div className="flex-1 overflow-y-auto p-6">
        <EventEditor initial={item} />
      </div>
    </>
  );
}

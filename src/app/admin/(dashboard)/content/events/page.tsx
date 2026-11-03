import { AdminHeader } from "@/components/admin/header";
import { EventsManager } from "@/components/admin/events-manager";
import { prisma } from "@/lib/prisma";

export default async function EventsAdminPage() {
  let events: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  try {
    events = await prisma.event.findMany({ orderBy: { date: "desc" } });
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Events" />
      <div className="flex-1 overflow-y-auto p-6">
        <EventsManager items={events} />
      </div>
    </>
  );
}

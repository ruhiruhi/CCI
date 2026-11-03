import { AdminHeader } from "@/components/admin/header";
import { EventEditor } from "@/components/admin/editors/event-editor";

export default function EventNewPage() {
  return (
    <>
      <AdminHeader title="New event" />
      <div className="flex-1 overflow-y-auto p-6">
        <EventEditor initial={null} />
      </div>
    </>
  );
}
